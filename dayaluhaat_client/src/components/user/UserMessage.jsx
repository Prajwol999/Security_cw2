import React, { useEffect, useState, useRef } from 'react';
import Peer from 'simple-peer';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useSocket } from '../../hooks/useSocket';
import { getSocket } from '../../services/socketService';
import { useAuth } from '../../hooks/useAuth';
import { fetchChatHistory, uploadChatFile } from '../../api/chatApi';
import { toast } from 'react-hot-toast';
import { 
    MessageSquareText, Send, Paperclip, Video, PhoneOff, Loader2, 
    FileText, Mic, StopCircle, PhoneIncoming 
} from 'lucide-react';

// Helper component for rendering different message types
const MessageContent = ({ message }) => {
    const fileUrl = message.fileUrl ? `http://localhost:5050${message.fileUrl}` : '';
    switch (message.messageType) {
        case 'image': return <img src={fileUrl} alt={message.fileName} className="max-w-xs rounded-lg cursor-pointer" onClick={() => window.open(fileUrl)} />;
        case 'audio': return <audio controls src={fileUrl} className="w-full" />;
        case 'video': return <video controls src={fileUrl} className="max-w-xs rounded-lg" />;
        case 'document': return <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200"><FileText className="h-6 w-6 text-blood-500" /><span>{message.fileName || 'Download'}</span></a>;
        default: return <div>{message.message}</div>;
    }
};

export default function UserMessage() {
    const { user, token } = useAuth();
    const { isConnected } = useSocket(token);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [stream, setStream] = useState(null);
    const [call, setCall] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const peerRef = useRef();
    const myVideo = useRef();
    const otherUserVideo = useRef();
    
    const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;

    const {
        status: recordingStatus,
        startRecording,
        stopRecording,
        mediaBlobUrl
    } = useReactMediaRecorder({ audio: true });

    useEffect(() => {
        if (token && user?.id && ADMIN_ID) {
            fetchChatHistory(ADMIN_ID).then(setMessages).catch(() => toast.error("Failed to load chat history.")).finally(() => setIsLoadingHistory(false));
        }
    }, [token, user?.id]);

    useEffect(() => {
        const socket = getSocket();
        if (!isConnected || !socket) return;

        const onMessage = (newMessage) => setMessages(prev => prev.find(m => m._id === newMessage._id) ? prev : [...prev, newMessage]);
        const onCallAccepted = (data) => { setCallAccepted(true); peerRef.current?.signal(data.signalData); };
        const onIncomingAdminCall = ({ from, name, signalData }) => setCall({ from, name, signalData, isReceivingCall: true });
        const onCallEnded = () => endCall(false);

        socket.on('message', onMessage);
        socket.on('call-accepted', onCallAccepted);
        socket.on('incoming-admin-call', onIncomingAdminCall);
        socket.on('call-ended', onCallEnded);

        return () => {
            socket.off('message', onMessage);
            socket.off('call-accepted', onCallAccepted);
            socket.off('incoming-admin-call', onIncomingAdminCall);
            socket.off('call-ended', onCallEnded);
        };
    }, [isConnected, user?.id]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    useEffect(() => {
        if (!mediaBlobUrl) return;
        async function sendVoiceNote() {
            const audioBlob = await fetch(mediaBlobUrl).then(res => res.blob());
            const fileName = `voice-note-${Date.now()}.wav`;
            const audioFile = new File([audioBlob], fileName, { type: audioBlob.type });
            const toastId = toast.loading('Sending voice note...');
            try {
                const { fileUrl } = await uploadChatFile(audioFile);
                getSocket()?.emit('message', { to: ADMIN_ID, fileUrl, fileName, messageType: 'audio' });
                toast.success('Voice note sent!', { id: toastId });
            } catch (error) { toast.error(error.message || 'Upload failed', { id: toastId }); }
        }
        sendVoiceNote();
    }, [mediaBlobUrl]);

    const handleSendMessage = () => {
        if (!text.trim() || !getSocket()?.connected) return;
        getSocket().emit('message', { to: ADMIN_ID, text: text.trim(), messageType: 'text' });
        setText("");
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const toastId = toast.loading('Uploading...');
        try {
            const { fileUrl, fileName, messageType } = await uploadChatFile(file);
            getSocket()?.emit('message', { to: ADMIN_ID, fileUrl, fileName, messageType });
            toast.success('Sent!', { id: toastId });
        } catch (error) { toast.error(error.message || 'Upload failed', { id: toastId }); }
        finally { if(fileInputRef.current) fileInputRef.current.value = ""; }
    };
    
    const startCall = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;
            const peer = new Peer({ initiator: true, trickle: false, stream: currentStream });
            peerRef.current = peer;
            peer.on('signal', (signalData) => getSocket().emit('start-call', { signalData }));
            peer.on('stream', (remoteStream) => { if (otherUserVideo.current) otherUserVideo.current.srcObject = remoteStream; });
        }).catch(() => toast.error("Could not access camera/microphone. Check permissions."));
    };

    const answerCall = () => {
        setCallAccepted(true);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;
            const peer = new Peer({ initiator: false, trickle: false, stream: currentStream });
            peerRef.current = peer;
            peer.on('signal', (signalData) => getSocket().emit('user-answered-call', { signalData, to: call.from }));
            peer.on('stream', (remoteStream) => { if (otherUserVideo.current) otherUserVideo.current.srcObject = remoteStream; });
            peer.signal(call.signalData);
        }).catch(() => toast.error("Could not access camera/microphone. Check permissions."));
    };
    
    const endCall = (shouldEmit = true) => {
        const targetId = call?.from || ADMIN_ID;
        if (shouldEmit) getSocket()?.emit('end-call', { to: targetId });
        setCall(null);
        setCallAccepted(false);
        if (stream) stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (peerRef.current) { peerRef.current.destroy(); peerRef.current = null; }
    };

    if (isLoadingHistory) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-10 w-10 animate-spin" /></div>;

    return (
        <div className="flex flex-col h-screen bg-gray-100 relative">
            {call?.isReceivingCall && !callAccepted && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-2xl z-50 flex flex-col items-center gap-4">
                    <h3 className="text-lg font-semibold">{call.name} is calling...</h3>
                    <button onClick={answerCall} className="p-3 bg-blood-500 text-white rounded-full"><PhoneIncoming /></button>
                </div>
            )}
            {stream && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 z-40 flex flex-col items-center justify-center p-4 gap-4">
                    <div className="flex gap-4 w-full h-2/3">{callAccepted && <video playsInline ref={otherUserVideo} autoPlay className="w-full h-full object-cover rounded-lg" />}</div>
                    <video playsInline muted ref={myVideo} autoPlay className="absolute bottom-5 right-5 w-48 h-auto rounded-lg shadow-2xl border-2 border-white" />
                    <button onClick={() => endCall(true)} className="absolute bottom-5 left-1/2 -translate-x-1/2 p-4 bg-red-600 text-white rounded-full"><PhoneOff /></button>
                </div>
            )}
            <header className="flex items-center justify-between p-4 bg-white shadow-md">
                <div className="flex items-center gap-3"><MessageSquareText className="h-8 w-8 text-blood-600" /><h1 className="text-xl font-bold">Chat with Admin</h1></div>
                <button onClick={startCall} className="p-2 rounded-full hover:bg-gray-200" title="Start Video Call"><Video/></button>
            </header>
            <main className="flex-1 p-4 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                        <div key={msg._id} className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg shadow ${msg.sender._id === user.id ? 'bg-blood-600 text-white' : 'bg-white text-black'}`}>
                                {msg.sender._id !== user.id && (<div className="font-bold text-sm mb-1 text-blood-700">{msg.sender.name || 'Admin'}</div>)}
                                <MessageContent message={msg} />
                                <div className="text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-4 bg-white border-t">
                <div className="flex items-center gap-3">
                    <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden"/>
                    <button onClick={() => fileInputRef.current.click()} className="p-3 rounded-full hover:bg-gray-200"><Paperclip /></button>
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 p-3 rounded-full border"/>
                    {recordingStatus === "recording" ? (<button onClick={stopRecording} className="p-3 bg-red-500 text-white rounded-full animate-pulse"><StopCircle /></button>) : (<button onClick={startRecording} className="p-3 bg-blood-500 text-white rounded-full"><Mic /></button>)}
                    <button onClick={handleSendMessage} className="p-3 bg-blood-600 text-white rounded-full"><Send /></button>
                </div>
            </footer>
        </div>
    );
}

