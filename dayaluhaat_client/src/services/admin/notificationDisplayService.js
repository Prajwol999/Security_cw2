// services/admin/notificationDisplayService.js
import toast from 'react-hot-toast'; // Assuming you're using react-hot-toast

/**
 * Handles the display of an in-app notification using react-hot-toast.
 * @param {object} payload - The notification payload from the backend.
 * Expected format: { title: "...", body: "...", data: { type: "...", ... } }
 */
export const showInAppNotification = (payload) => {
  const { title, body, data } = payload;

  console.log("Displaying in-app notification:", payload);

  toast.info(body, {
    icon: '🔔', // You can customize the icon
    duration: 5000, // Display for 5 seconds
    position: 'top-right', // Adjust position as needed
    style: {
      background: '#e0f2f7', // Light blue background
      color: '#01579b',     // Dark blue text
      border: '1px solid #81d4fa',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      fontWeight: 'bold',
    },
    onClick: () => {
      console.log("Notification toast clicked, payload data:", data);
      // You can add navigation logic here if you set up a router instance globally or pass it via context
      // Example: history.push(`/some-path/${data.id}`);
    }
  });
};