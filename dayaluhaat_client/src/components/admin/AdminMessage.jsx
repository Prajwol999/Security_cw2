import React, { useEffect, useState, useRef, useCallback } from 'react';
import Peer from 'simple-peer';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useSocket } from '../../hooks/useSocket';
import { getSocket } from '../../services/socketService';
import { useAuth } from '../../hooks/useAuth';
import { fetchChatHistory, fetchConversations, uploadChatFile } from '../../api/chatApi';
import { toast } from 'react-hot-toast';
import { 
    MessageSquareText, Users, Send, Paperclip, Loader2, FileText, 
    PhoneOff, PhoneIncoming, Video, Mic, StopCircle 
} from 'lucide-react';

const MessageContent = ({ message, adminUserId }) => {
    const fileUrl = message.fileUrl ? `http://localhost:5050${message.fileUrl}` : '';
    switch (message.messageType) {
        case 'image': return <img src={fileUrl} alt={message.fileName} className="max-w-xs rounded-lg" />;
        case 'audio': return <audio controls src={fileUrl} className="w-full" />;
        case 'video': return <video controls src={fileUrl} className="max-w-xs rounded-lg" />;
        case 'document': return <a href={fileUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 p-2 rounded-lg text-black ${message.sender._id === adminUserId ? 'bg-blue-200 hover:bg-blue-300' : 'bg-gray-100 hover:bg-gray-200'}`}><FileText className="h-6 w-6 text-blood-500" /><span>{message.fileName}</span></a>;
        default: return <div>{message.message}</div>;
    }
};

export default function AdminMessage() {
    const { user: adminUser, token } = useAuth();
    const { isConnected } = useSocket(token);
    const [conversations, setConversations] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const [call, setCall] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [stream, setStream] = useState(null);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const peerRef = useRef();
    const myVideo = useRef();
    const otherUserVideo = useRef();

    const {
        status: recordingStatus,
        startRecording,
        stopRecording,
        mediaBlobUrl
    } = useReactMediaRecorder({ audio: true });

    useEffect(() => {
        if (token && adminUser?.role === 'admin') {
            fetchConversations().then(users => {
                const convs = {};
                users.forEach(user => { convs[user._id] = { userInfo: user, messages: [], unreadCount: 0 }; });
                setConversations(convs);
            }).catch(() => toast.error("Could not load conversations."));
        }
    }, [token, adminUser]);

    useEffect(() => {
        const socket = getSocket();
        if (!isConnected || !socket) return;

        const onMessage = (newMessage) => {
            const relevantUserId = adminUser.id === newMessage.sender._id ? newMessage.receiver : newMessage.sender._id;
            setConversations(prev => {
                const newConvs = { ...prev };
                if (!newConvs[relevantUserId]) {
                    newConvs[relevantUserId] = { userInfo: newMessage.sender, messages: [], unreadCount: 0 };
                }
                if (!newConvs[relevantUserId].messages.find(m => m._id === newMessage._id)) {
                    newConvs[relevantUserId].messages.push(newMessage);
                    if (relevantUserId !== selectedUserId) {
                        newConvs[relevantUserId].unreadCount++;
                    }
                }
                return newConvs;
            });
        };
        const onIncomingCall = ({ from, name, signalData }) => setCall({ from, name, signalData, isReceivingCall: true });
        const onUserAnswered = (data) => { setCallAccepted(true); peerRef.current?.signal(data.signalData); };
        const onCallEnded = () => endCall(false);

        socket.on('message', onMessage);
        socket.on('incoming-call', onIncomingCall);
        socket.on('user-answered', onUserAnswered);
        socket.on('call-ended', onCallEnded);
        
        return () => {
            socket.off('message', onMessage);
            socket.off('incoming-call', onIncomingCall);
            socket.off('user-answered', onUserAnswered);
            socket.off('call-ended', onCallEnded);
        };
    }, [isConnected, adminUser?.id, selectedUserId]);

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversations[selectedUserId]?.messages]);

    useEffect(() => {
        if (!mediaBlobUrl || !selectedUserId) return;
        async function sendVoiceNote() {
            const audioBlob = await fetch(mediaBlobUrl).then(res => res.blob());
            const fileName = `voice-note-from-admin-${Date.now()}.wav`;
            const audioFile = new File([audioBlob], fileName, { type: audioBlob.type });
            const toastId = toast.loading('Sending voice note...');
            try {
                const { fileUrl } = await uploadChatFile(audioFile);
                getSocket()?.emit('message', { to: selectedUserId, fileUrl, fileName, messageType: 'audio' });
                toast.success('Voice note sent!', { id: toastId });
            } catch (error) { toast.error(error.message || 'Upload failed', { id: toastId }); }
        }
        sendVoiceNote();
    }, [mediaBlobUrl, selectedUserId]);

    const handleSelectConversation = useCallback((userId) => {
        setSelectedUserId(userId);
        if (conversations[userId] && conversations[userId].messages.length === 0) {
            setIsLoading(true);
            fetchChatHistory(userId)
                .then(history => setConversations(prev => ({ ...prev, [userId]: { ...prev[userId], messages: history, unreadCount: 0 } })))
                .catch(() => toast.error(`Failed to load history for ${conversations[userId].userInfo.name}`))
                .finally(() => setIsLoading(false));
        } else {
             setConversations(prev => ({ ...prev, [userId]: { ...prev[userId], unreadCount: 0 } }));
        }
    }, [conversations]);

    const handleSendMessage = () => {
        if (!text.trim() || !getSocket()?.connected || !selectedUserId) return;
        getSocket().emit('message', { to: selectedUserId, text: text.trim(), messageType: 'text' });
        setText("");
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || !selectedUserId) return;
        const toastId = toast.loading('Uploading...');
        try {
            const { fileUrl, fileName, messageType } = await uploadChatFile(file);
            getSocket()?.emit('message', { to: selectedUserId, fileUrl, fileName, messageType });
            toast.success('Sent!', { id: toastId });
        } catch (error) { toast.error(error.message, { id: toastId }); }
        finally { if(fileInputRef.current) fileInputRef.current.value = ""; }
    };

    const startCallWithUser = () => {
        if (!selectedUserId) return toast.error("Please select a user to call.");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;
            const peer = new Peer({ initiator: true, trickle: false, stream: currentStream });
            peerRef.current = peer;
            peer.on('signal', (signalData) => getSocket().emit('admin-start-call', { to: selectedUserId, signalData }));
            peer.on('stream', (remoteStream) => { if (otherUserVideo.current) otherUserVideo.current.srcObject = remoteStream; });
        }).catch(() => toast.error("Could not access camera/microphone."));
    };
    
    const answerCall = () => {
        setCallAccepted(true);
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;
            const peer = new Peer({ initiator: false, trickle: false, stream: currentStream });
            peerRef.current = peer;
            peer.on('signal', (signalData) => getSocket().emit('answer-call', { signalData, to: call.from }));
            peer.on('stream', (remoteStream) => { if (otherUserVideo.current) otherUserVideo.current.srcObject = remoteStream; });
            peer.signal(call.signalData);
        }).catch(() => toast.error("Could not access camera/microphone."));
    };
    
    const endCall = (shouldEmit = true) => {
        const targetUserId = call?.from || selectedUserId;
        if (shouldEmit && targetUserId) getSocket()?.emit('end-call', { to: targetUserId });
        setCallAccepted(false); setCall(null);
        if (stream) stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (peerRef.current) { peerRef.current.destroy(); peerRef.current = null; }
    };
    
    const selectedConversation = conversations[selectedUserId];

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {call?.isReceivingCall && !callAccepted && ( <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-2xl z-50 flex flex-col items-center gap-4"><h3 className="text-lg font-semibold">{call.name} is calling...</h3><button onClick={answerCall} className="p-3 bg-blood-500 text-white rounded-full"><PhoneIncoming /></button></div> )}
            {callAccepted && ( <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-90 z-40 flex flex-col items-center justify-center p-4 gap-4"><div className="flex gap-4 w-full h-2/3"><video playsInline ref={otherUserVideo} autoPlay className="w-full h-full object-cover rounded-lg" /></div><video playsInline muted ref={myVideo} autoPlay className="absolute bottom-5 right-5 w-48 h-auto rounded-lg shadow-2xl border-2 border-white" /><button onClick={() => endCall(true)} className="absolute bottom-5 left-1/2 -translate-x-1/2 p-4 bg-red-600 text-white rounded-full"><PhoneOff /></button></div> )}
            
            <div className="w-1/3 border-r bg-white flex flex-col">
                <header className="p-4 border-b font-bold text-lg flex items-center gap-3"><Users/> Conversations</header>
                <div className="flex-1 overflow-y-auto">{Object.values(conversations).map(({ userInfo, unreadCount }) => (<div key={userInfo._id} onClick={() => handleSelectConversation(userInfo._id)} className={`p-4 cursor-pointer border-l-4 ${selectedUserId === userInfo._id ? 'border-blood-500 bg-blood-50' : 'border-transparent hover:bg-gray-50'}`}><div className="flex justify-between"><span className="font-semibold">{userInfo.name || userInfo.email}</span>{unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{unreadCount}</span>}</div></div>))}</div>
            </div>

            <div className="w-2/3 flex flex-col">
                {selectedUserId ? (
                    <>
                        <header className="p-4 border-b bg-white font-bold flex justify-between items-center">
                            <span>{selectedConversation?.userInfo.name}</span>
                            <button onClick={startCallWithUser} className="p-2 rounded-full hover:bg-gray-200" title={`Call ${selectedConversation?.userInfo.name}`}><Video /></button>
                        </header>
                        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">{isLoading ? <div className="flex justify-center"><Loader2 className="animate-spin"/></div> : <div className="flex flex-col gap-4">{selectedConversation?.messages.map((msg) => (<div key={msg._id} className={`flex ${msg.sender._id === adminUser.id ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[70%] p-3 rounded-lg shadow ${msg.sender._id === adminUser.id ? 'bg-blood-600 text-white' : 'bg-white text-black'}`}><MessageContent message={msg} adminUserId={adminUser.id} /><div className="text-xs text-right mt-1 opacity-70">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div></div></div>))}{<div ref={messagesEndRef} />}</div>}</main>
                        <footer className="p-4 bg-white border-t"><div className="flex items-center gap-3"><input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden"/><button onClick={() => fileInputRef.current.click()} className="p-3 rounded-full hover:bg-gray-200"><Paperclip /></button><input type="text" value={text} onChange={e => setText(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 p-3 rounded-full border"/>{recordingStatus === "recording" ? (<button onClick={stopRecording} className="p-3 bg-red-500 text-white rounded-full animate-pulse"><StopCircle /></button>) : (<button onClick={startRecording} className="p-3 bg-blood-500 text-white rounded-full"><Mic /></button>)}<button onClick={handleSendMessage} className="p-3 bg-blood-600 text-white rounded-full"><Send /></button></div></footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400"><MessageSquareText className="h-10 w-10 mr-4"/> Select a conversation to start chatting.</div>
                )}
            </div>
        </div>
    );
}

