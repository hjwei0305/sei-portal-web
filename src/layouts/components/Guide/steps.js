import { formatMessage } from 'umi-plugin-react/locale';

const steps = [
  {
    element: '#menu-search-container',
    popover: {
      title: formatMessage({ id: 'app.step.menu.search.title', defaultMessage: '菜单搜索' }),
      description: formatMessage({
        id: 'app.step.menu.search.desc',
        defaultMessage: '可以输入关键字，对于菜单进行快速搜索',
      }),
      position: 'bottom',
    },
    stageBackground: 'transparent',
    padding: 0,
  },
  {
    element: '#favorite-container',
    stageBackground: 'transparent',
    popover: {
      title: formatMessage({ id: 'app.step.menu.collection.title', defaultMessage: '菜单收藏' }),
      description: formatMessage({
        id: 'app.step.menu.collection.desc',
        defaultMessage: '对于常用的菜单进行收藏操作，便于使用',
      }),
      position: 'right',
    },
    padding: 0,
  },
  {
    element: '#app-icon-wrapper',
    popover: {
      title: formatMessage({ id: 'app.step.application.toggle.title', defaultMessage: '切换应用' }),
      description: formatMessage({
        id: 'app.step.application.toggle.desc',
        defaultMessage: '可以选择切换具有权限的应用',
      }),
      position: 'bottom',
    },
    padding: 0,
  },
  {
    element: '#homepage-icon-container',
    popover: {
      title: formatMessage({ id: 'app.step.dashboard.title', defaultMessage: '首页' }),
      description: formatMessage({ id: 'app.step.dashboard.desc', defaultMessage: '链接到首页' }),
      position: 'bottom',
    },
    padding: 0,
  },
  {
    element: '#center-tabs',
    popover: {
      title: formatMessage({ id: 'app.step.tabs.title', defaultMessage: '页签容器' }),
      description: formatMessage({
        id: 'app.step.tabs.desc',
        defaultMessage: '显示当前用户打开的所有页签，并且可以对打开的页签进行关闭，刷新等操作',
      }),
      position: 'bottom',
    },
    padding: 0,
  },
  {
    element: '#robot-wrapper',
    popover: {
      title: formatMessage({ id: 'app.step.wit.title', defaultMessage: '小智' }),
      description: formatMessage({
        id: 'app.step.wit.desc',
        defaultMessage: '可以通过提问的方式，解决你在系统中遇到的问题。',
      }),
      position: 'bottom-right',
    },
    padding: 0,
  },
  {
    element: '#notify-container',
    popover: {
      title: formatMessage({ id: 'app.step.message.title', defaultMessage: '消息提醒' }),
      description: formatMessage({
        id: 'app.step.message.desc',
        defaultMessage: '提醒用户有新的消息，并且能够查看消息详情',
      }),
      position: 'bottom-right',
    },
    padding: 0,
  },
  {
    element: '#user-icon-wrapper',
    popover: {
      title: formatMessage({ id: 'app.step.setting.title', defaultMessage: '个人操作' }),
      description: formatMessage({
        id: 'app.step.setting.desc',
        defaultMessage: '点击显示个人操作菜单，包括个人设置，退出登录等',
      }),
      position: 'bottom-right',
    },
    padding: 0,
  },
  {
    element: '#screenfull-container',
    popover: {
      title: formatMessage({ id: 'app.step.screenfull.title', defaultMessage: '全屏操作' }),
      description: formatMessage({
        id: 'app.step.screenfull.desc',
        defaultMessage: '设置页面进入全屏模式',
      }),
      position: 'bottom-right',
    },
    padding: 0,
  },
  {
    element: '#collapse-icon-container',
    stageBackground: 'transparent',
    popover: {
      title: formatMessage({ id: 'app.step.collapse.title', defaultMessage: '折叠操作' }),
      description: formatMessage({
        id: 'app.step.collapse.desc',
        defaultMessage: '打开或者关闭侧边菜单栏',
      }),
      position: 'right-bottom',
    },
    padding: 0,
  },
];

export default steps;
