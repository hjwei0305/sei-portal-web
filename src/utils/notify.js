const options = {
  dir: 'auto', // 文字方向
  body: '通知：OBKoro1评论了你的朋友圈', // 通知主体
  requireInteraction: true, // 不自动关闭通知
  // 通知图标
  icon:
    'https://upload-images.jianshu.io/upload_images/5245297-818e624b75271127.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240',
};

export default title => {
  let notification = null;
  // 先检查浏览器是否支持
  if (window.Notification) {
    // 检查用户曾经是否同意接受通知
    if (Notification.permission === 'granted') {
      notification = new Notification(title, options); // 显示通知
      notification.onclick = () => {
        console.log('click');
      };
    } else if (Notification.permission === 'default') {
      // 用户还未选择，可以询问用户是否同意发送通知
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          notification = new Notification(title, options); // 显示通知
        } else if (permission === 'default') {
          console.log('可以再次发起');
        } else {
          // denied
          console.log('用户拒绝授权 不能显示通知');
        }
      });
    } else {
      console.log('用户曾经拒绝显示通知');
    }
  }
};
