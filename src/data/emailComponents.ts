import type { ComponentConfig } from '../types';

// 邮件模板专用组件库
export const emailComponents: ComponentConfig[] = [
  // 邮件头部组件
  {
    id: 'email-header',
    type: 'email-header',
    name: '邮件头部',
    props: {
      logo: '',
      companyName: '公司名称',
      tagline: '公司标语',
      backgroundColor: '#ffffff',
      padding: '20px',
    },
  },
  // 邮件标题组件
  {
    id: 'email-title',
    type: 'email-title',
    name: '邮件标题',
    props: {
      title: '邮件标题',
      subtitle: '副标题',
      textAlign: 'center',
      color: '#333333',
      fontSize: '24px',
      backgroundColor: '#f8f9fa',
      padding: '30px 20px',
    },
  },
  // 邮件内容区域
  {
    id: 'email-content',
    type: 'email-content',
    name: '邮件内容',
    props: {
      content: '这里是邮件的主要内容，可以包含文字、图片、链接等元素。',
      backgroundColor: '#ffffff',
      padding: '30px 20px',
      textAlign: 'left',
      lineHeight: '1.6',
      color: '#333333',
    },
  },
  // 邮件按钮
  {
    id: 'email-button',
    type: 'email-button',
    name: '邮件按钮',
    props: {
      text: '点击按钮',
      url: '#',
      backgroundColor: '#007bff',
      textColor: '#ffffff',
      borderRadius: '4px',
      padding: '12px 24px',
      fontSize: '16px',
      textAlign: 'center',
    },
  },
  // 邮件图片
  {
    id: 'email-image',
    type: 'email-image',
    name: '邮件图片',
    props: {
      src: 'https://via.placeholder.com/600x300',
      alt: '图片描述',
      width: '100%',
      maxWidth: '600px',
      height: 'auto',
      textAlign: 'center',
      padding: '20px',
    },
  },
  // 邮件分割线
  {
    id: 'email-divider',
    type: 'email-divider',
    name: '邮件分割线',
    props: {
      color: '#e9ecef',
      height: '1px',
      margin: '20px 0',
      width: '100%',
    },
  },
  // 邮件脚部
  {
    id: 'email-footer',
    type: 'email-footer',
    name: '邮件脚部',
    props: {
      content: '© 2024 公司名称. 保留所有权利.',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      textAlign: 'center',
      fontSize: '12px',
      color: '#6c757d',
    },
  },
  // 邮件两列布局
  {
    id: 'email-two-column',
    type: 'email-two-column',
    name: '两列布局',
    props: {
      leftContent: '<div style="padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;"><h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">左侧标题</h3><p style="margin: 0; color: #666; line-height: 1.5;">这里是左侧的内容区域，可以放置文字、图片或其他元素。</p></div>',
      rightContent: '<div style="padding: 15px; background-color: #e3f2fd; border-radius: 8px; text-align: center;"><h3 style="margin: 0 0 10px 0; color: #333; font-size: 18px;">右侧标题</h3><p style="margin: 0; color: #666; line-height: 1.5;">这里是右侧的内容区域，可以放置文字、图片或其他元素。</p></div>',
      backgroundColor: '#ffffff',
      padding: '20px',
      columnGap: '20px',
    },
  },
  // 邮件三列布局
  {
    id: 'email-three-column',
    type: 'email-three-column',
    name: '三列布局',
    props: {
      leftContent: '<div style="padding: 12px; background-color: #f8f9fa; border-radius: 6px; text-align: center;"><h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">左侧</h4><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">左侧内容</p></div>',
      centerContent: '<div style="padding: 12px; background-color: #e3f2fd; border-radius: 6px; text-align: center;"><h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">中间</h4><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">中间内容</p></div>',
      rightContent: '<div style="padding: 12px; background-color: #f3e5f5; border-radius: 6px; text-align: center;"><h4 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">右侧</h4><p style="margin: 0; color: #666; font-size: 14px; line-height: 1.4;">右侧内容</p></div>',
      backgroundColor: '#ffffff',
      padding: '20px',
      columnGap: '15px',
    },
  },
  // 邮件促销横幅
  {
    id: 'email-banner',
    type: 'email-banner',
    name: '促销横幅',
    props: {
      title: '限时优惠',
      subtitle: '立即购买享受8折优惠',
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff',
      padding: '40px 20px',
      textAlign: 'center',
      fontSize: '20px',
    },
  },
  // 邮件产品展示
  {
    id: 'email-product',
    type: 'email-product',
    name: '产品展示',
    props: {
      productName: '产品名称',
      productDescription: '产品描述',
      productPrice: '¥99.00',
      productImage: 'https://via.placeholder.com/200x200',
      backgroundColor: '#ffffff',
      padding: '20px',
      border: '1px solid #e9ecef',
      borderRadius: '8px',
    },
  },
  // 邮件社交媒体链接
  {
    id: 'email-social',
    type: 'email-social',
    name: '社交媒体',
    props: {
      facebook: '#',
      twitter: '#',
      instagram: '#',
      linkedin: '#',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      textAlign: 'center',
    },
  },
];

// 邮件模板预设布局
export const emailTemplates = [
  {
    id: 'newsletter-template',
    name: '新闻通讯模板',
    description: '适用于新闻通讯、产品更新等',
    components: [
      'email-header',
      'email-title',
      'email-content',
      'email-image',
      'email-button',
      'email-divider',
      'email-footer',
    ],
  },
  {
    id: 'promotion-template',
    name: '促销活动模板',
    description: '适用于促销活动、优惠券等',
    components: [
      'email-header',
      'email-banner',
      'email-product',
      'email-button',
      'email-divider',
      'email-footer',
    ],
  },
  {
    id: 'welcome-template',
    name: '欢迎邮件模板',
    description: '适用于用户注册、欢迎新用户等',
    components: [
      'email-header',
      'email-title',
      'email-content',
      'email-button',
      'email-social',
      'email-footer',
    ],
  },
  {
    id: 'two-column-template',
    name: '两列布局模板',
    description: '适用于产品对比、功能展示等',
    components: [
      'email-header',
      'email-title',
      'email-two-column',
      'email-button',
      'email-footer',
    ],
  },
];
