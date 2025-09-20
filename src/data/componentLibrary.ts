import type { ComponentLibrary } from '../types';

export const getComponentLibraries = (t: (key: string) => string): ComponentLibrary[] => [
  {
    category: t('categories.basic'),
    components: [
      {
        type: 'button',
        name: t('components.button.name'),
        icon: '🔘',
        category: t('categories.basic'),
        description: t('components.button.description'),
        defaultProps: {
          text: '按钮',
          type: 'default',
          size: 'middle',
          disabled: false,
        },
        propTypes: [
          { name: 'text', type: 'string', label: '按钮文本', required: true },
          { name: 'type', type: 'select', label: '按钮类型', options: [
            { label: '默认', value: 'default' },
            { label: '主要', value: 'primary' },
            { label: '虚线', value: 'dashed' },
            { label: '文本', value: 'text' },
            { label: '链接', value: 'link' },
          ] },
          { name: 'size', type: 'select', label: '按钮大小', options: [
            { label: '小', value: 'small' },
            { label: '中', value: 'middle' },
            { label: '大', value: 'large' },
          ] },
          { name: 'disabled', type: 'boolean', label: '禁用状态' },
        ],
      },
      {
        type: 'input',
        name: '输入框',
        icon: '📝',
        category: '基础组件',
        description: '文本输入组件',
        defaultProps: {
          placeholder: '请输入内容',
          size: 'middle',
          disabled: false,
        },
        propTypes: [
          { name: 'placeholder', type: 'string', label: '占位符' },
          { name: 'size', type: 'select', label: '输入框大小', options: [
            { label: '小', value: 'small' },
            { label: '中', value: 'middle' },
            { label: '大', value: 'large' },
          ] },
          { name: 'disabled', type: 'boolean', label: '禁用状态' },
        ],
      },
      {
        type: 'text',
        name: '文本',
        icon: '📄',
        category: '基础组件',
        description: '显示文本内容',
        defaultProps: {
          content: '文本内容',
          fontSize: 14,
        },
        propTypes: [
          { name: 'content', type: 'string', label: '文本内容', required: true },
          { name: 'color', type: 'color', label: '文字颜色' },
          { name: 'fontSize', type: 'number', label: '字体大小' },
        ],
      },
      {
        type: 'title',
        name: '标题',
        icon: '📋',
        category: '基础组件',
        description: '标题文本组件',
        defaultProps: {
          content: '标题',
          level: 1,
        },
        propTypes: [
          { name: 'content', type: 'string', label: '标题内容', required: true },
          { name: 'level', type: 'select', label: '标题级别', options: [
            { label: 'H1', value: 1 },
            { label: 'H2', value: 2 },
            { label: 'H3', value: 3 },
            { label: 'H4', value: 4 },
            { label: 'H5', value: 5 },
          ] },
          { name: 'color', type: 'color', label: '文字颜色' },
        ],
      },
      {
        type: 'paragraph',
        name: '段落',
        icon: '📃',
        category: '基础组件',
        description: '段落文本组件',
        defaultProps: {
          content: '段落内容',
        },
        propTypes: [
          { name: 'content', type: 'textarea', label: '段落内容', required: true },
          { name: 'color', type: 'color', label: '文字颜色' },
        ],
      },
    ],
  },
  {
    category: '布局组件',
    components: [
      {
        type: 'container',
        name: '容器',
        icon: '📦',
        category: '布局组件',
        description: '通用容器组件',
        defaultProps: {
          padding: 16,
          margin: 0,
        },
        propTypes: [
          { name: 'backgroundColor', type: 'color', label: '背景颜色' },
          { name: 'padding', type: 'number', label: '内边距' },
          { name: 'margin', type: 'number', label: '外边距' },
        ],
      },
      {
        type: 'card',
        name: '卡片',
        icon: '🃏',
        category: '布局组件',
        description: '卡片容器组件',
        defaultProps: {
          title: '卡片标题',
          content: '卡片内容',
          bordered: true,
        },
        propTypes: [
          { name: 'title', type: 'string', label: '卡片标题' },
          { name: 'content', type: 'textarea', label: '卡片内容' },
          { name: 'bordered', type: 'boolean', label: '显示边框' },
        ],
      },
      {
        type: 'space',
        name: '间距',
        icon: '↔️',
        category: '布局组件',
        description: '组件间距容器',
        defaultProps: {
          size: 'middle',
          direction: 'horizontal',
        },
        propTypes: [
          { name: 'size', type: 'select', label: '间距大小', options: [
            { label: '小', value: 'small' },
            { label: '中', value: 'middle' },
            { label: '大', value: 'large' },
          ] },
          { name: 'direction', type: 'select', label: '排列方向', options: [
            { label: '水平', value: 'horizontal' },
            { label: '垂直', value: 'vertical' },
          ] },
        ],
      },
    ],
  },
  {
    category: '媒体组件',
    components: [
      {
        type: 'image',
        name: '图片',
        icon: '🖼️',
        category: '媒体组件',
        description: '图片显示组件',
        defaultProps: {
          src: 'https://via.placeholder.com/200x150',
          alt: '图片',
          width: 200,
          height: 150,
        },
        propTypes: [
          { name: 'src', type: 'string', label: '图片地址', required: true },
          { name: 'alt', type: 'string', label: '替代文本' },
          { name: 'width', type: 'number', label: '宽度' },
          { name: 'height', type: 'number', label: '高度' },
        ],
      },
    ],
  },
  {
    category: '表单组件',
    components: [
      {
        type: 'textarea',
        name: '文本域',
        icon: '📝',
        category: '表单组件',
        description: '多行文本输入组件',
        defaultProps: {
          placeholder: '请输入内容',
          rows: 4,
          disabled: false,
        },
        propTypes: [
          { name: 'placeholder', type: 'string', label: '占位符' },
          { name: 'rows', type: 'number', label: '行数' },
          { name: 'disabled', type: 'boolean', label: '禁用状态' },
        ],
      },
      {
        type: 'select',
        name: '选择器',
        icon: '📋',
        category: '表单组件',
        description: '下拉选择组件',
        defaultProps: {
          placeholder: '请选择',
          disabled: false,
        },
        propTypes: [
          { name: 'placeholder', type: 'string', label: '占位符' },
          { name: 'disabled', type: 'boolean', label: '禁用状态' },
        ],
      },
      {
        type: 'switch',
        name: '开关',
        icon: '🔘',
        category: '表单组件',
        description: '开关切换组件',
        defaultProps: {
          checked: false,
          disabled: false,
        },
        propTypes: [
          { name: 'checked', type: 'boolean', label: '是否选中' },
          { name: 'disabled', type: 'boolean', label: '禁用状态' },
        ],
      },
    ],
  },
  {
    category: '数据展示',
    components: [
      {
        type: 'divider',
        name: '分割线',
        icon: '➖',
        category: '数据展示',
        description: '内容分割线组件',
        defaultProps: {
          type: 'horizontal',
          orientation: 'center',
        },
        propTypes: [
          { name: 'type', type: 'select', label: '分割线类型', options: [
            { label: '水平', value: 'horizontal' },
            { label: '垂直', value: 'vertical' },
          ] },
          { name: 'orientation', type: 'select', label: '文字位置', options: [
            { label: '左侧', value: 'left' },
            { label: '居中', value: 'center' },
            { label: '右侧', value: 'right' },
          ] },
        ],
      },
      {
        type: 'badge',
        name: '徽标',
        icon: '🏷️',
        category: '数据展示',
        description: '徽标数提示组件',
        defaultProps: {
          count: 5,
          showZero: false,
        },
        propTypes: [
          { name: 'count', type: 'number', label: '徽标数' },
          { name: 'showZero', type: 'boolean', label: '显示零值' },
        ],
      },
    ],
  },
];
