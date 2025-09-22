const vapidKey = import.meta.env.VITE_VAPID_PUBLIC;

export async function subscribeToPush() {
  const permission = await Notification.requestPermission();
  // if (permission !== "granted") {
  //   alert("Please enable notifications!");
  //   return;
  // }
  if (permission === "granted") {
    const reg = await navigator.serviceWorker.register("/sw.js");
  
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(subscription),
    });
  }
}
