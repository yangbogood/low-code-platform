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
          text: t('components.button.text'),
          type: 'default',
          size: 'middle',
          disabled: false,
        },
        propTypes: [
          { name: 'text', type: 'string', label: t('components.button.text'), required: true },
          { name: 'type', type: 'select', label: t('components.button.type'), options: [
            { label: t('components.button.types.default'), value: 'default' },
            { label: t('components.button.types.primary'), value: 'primary' },
            { label: t('components.button.types.dashed'), value: 'dashed' },
            { label: t('components.button.types.text'), value: 'text' },
            { label: t('components.button.types.link'), value: 'link' },
          ] },
          { name: 'size', type: 'select', label: t('components.button.size'), options: [
            { label: t('components.button.sizes.small'), value: 'small' },
            { label: t('components.button.sizes.middle'), value: 'middle' },
            { label: t('components.button.sizes.large'), value: 'large' },
          ] },
          { name: 'disabled', type: 'boolean', label: t('components.button.disabled'), required: false },
        ],
      },
      {
        type: 'input',
        name: t('components.input.name'),
        icon: '📝',
        category: t('categories.basic'),
        description: t('components.input.description'),
        defaultProps: {
          placeholder: t('components.input.defaultPlaceholder'),
          size: 'middle',
          disabled: false,
        },
        propTypes: [
          { name: 'placeholder', type: 'string', label: t('components.input.placeholder'), required: false },
          { name: 'size', type: 'select', label: t('components.input.size'), options: [
            { label: t('components.input.sizes.small'), value: 'small' },
            { label: t('components.input.sizes.middle'), value: 'middle' },
            { label: t('components.input.sizes.large'), value: 'large' },
          ] },
          { name: 'disabled', type: 'boolean', label: t('components.input.disabled'), required: false },
        ],
      },
      {
        type: 'text',
        name: t('components.text.name'),
        icon: '📄',
        category: t('categories.basic'),
        description: t('components.text.description'),
        defaultProps: {
          content: t('components.text.defaultContent'),
        },
        propTypes: [
          { name: 'content', type: 'string', label: t('components.text.content'), required: true },
          { name: 'color', type: 'color', label: t('components.text.color'), required: false },
          { name: 'fontSize', type: 'number', label: t('components.text.fontSize'), required: false },
        ],
      },
      {
        type: 'title',
        name: t('components.title.name'),
        icon: '📋',
        category: t('categories.basic'),
        description: t('components.title.description'),
        defaultProps: {
          content: t('components.title.defaultContent'),
          level: 1,
        },
        propTypes: [
          { name: 'content', type: 'string', label: t('components.title.content'), required: true },
          { name: 'level', type: 'select', label: t('components.title.level'), options: [
            { label: t('components.title.levels.h1'), value: 1 },
            { label: t('components.title.levels.h2'), value: 2 },
            { label: t('components.title.levels.h3'), value: 3 },
            { label: t('components.title.levels.h4'), value: 4 },
            { label: t('components.title.levels.h5'), value: 5 },
          ] },
          { name: 'color', type: 'color', label: t('components.title.color'), required: false },
        ],
      },
      {
        type: 'paragraph',
        name: t('components.paragraph.name'),
        icon: '📃',
        category: t('categories.basic'),
        description: t('components.paragraph.description'),
        defaultProps: {
          content: t('components.paragraph.defaultContent'),
        },
        propTypes: [
          { name: 'content', type: 'textarea', label: t('components.paragraph.content'), required: true },
          { name: 'color', type: 'color', label: t('components.paragraph.color'), required: false },
        ],
      },
    ],
  },
  {
    category: t('categories.layout'),
    components: [
      {
        type: 'card',
        name: t('components.card.name'),
        icon: '🃏',
        category: t('categories.layout'),
        description: t('components.card.description'),
        defaultProps: {
          title: t('components.card.defaultTitle'),
          content: t('components.card.defaultContent'),
          bordered: true,
        },
        propTypes: [
          { name: 'title', type: 'string', label: t('components.card.title'), required: false },
          { name: 'content', type: 'textarea', label: t('components.card.content'), required: false },
          { name: 'bordered', type: 'boolean', label: t('components.card.bordered'), required: false },
        ],
      },
      {
        type: 'container',
        name: t('components.container.name'),
        icon: '📦',
        category: t('categories.layout'),
        description: t('components.container.description'),
        defaultProps: {
          padding: 16,
          margin: 0,
        },
        propTypes: [
          { name: 'backgroundColor', type: 'color', label: t('components.container.backgroundColor'), required: false },
          { name: 'padding', type: 'number', label: t('components.container.padding'), required: false },
          { name: 'margin', type: 'number', label: t('components.container.margin'), required: false },
        ],
      },
    ],
  },
  {
    category: t('categories.form'),
    components: [
      {
        type: 'textarea',
        name: t('components.textarea.name'),
        icon: '📝',
        category: t('categories.form'),
        description: t('components.textarea.description'),
        defaultProps: {
          placeholder: t('components.textarea.defaultPlaceholder'),
          rows: 4,
          disabled: false,
        },
        propTypes: [
          { name: 'placeholder', type: 'string', label: t('components.textarea.placeholder'), required: false },
          { name: 'rows', type: 'number', label: t('components.textarea.rows'), required: false },
          { name: 'disabled', type: 'boolean', label: t('components.textarea.disabled'), required: false },
        ],
      },
      {
        type: 'select',
        name: t('components.select.name'),
        icon: '📋',
        category: t('categories.form'),
        description: t('components.select.description'),
        defaultProps: {
          placeholder: t('components.select.defaultPlaceholder'),
          disabled: false,
        },
        propTypes: [
          { name: 'placeholder', type: 'string', label: t('components.select.placeholder'), required: false },
          { name: 'disabled', type: 'boolean', label: t('components.select.disabled'), required: false },
        ],
      },
      {
        type: 'switch',
        name: t('components.switch.name'),
        icon: '🔀',
        category: t('categories.form'),
        description: t('components.switch.description'),
        defaultProps: {
          checked: false,
          disabled: false,
        },
        propTypes: [
          { name: 'checked', type: 'boolean', label: t('components.switch.checked'), required: false },
          { name: 'disabled', type: 'boolean', label: t('components.switch.disabled'), required: false },
        ],
      },
    ],
  },
  {
    category: t('categories.data'),
    components: [
      {
        type: 'image',
        name: t('components.image.name'),
        icon: '🖼️',
        category: t('categories.data'),
        description: t('components.image.description'),
        defaultProps: {
          src: 'https://via.placeholder.com/200x150',
          alt: t('components.image.defaultAlt'),
          width: 200,
          height: 150,
        },
        propTypes: [
          { name: 'src', type: 'string', label: t('components.image.src'), required: true },
          { name: 'alt', type: 'string', label: t('components.image.alt'), required: false },
          { name: 'width', type: 'number', label: t('components.image.width'), required: false },
          { name: 'height', type: 'number', label: t('components.image.height'), required: false },
        ],
      },
      {
        type: 'badge',
        name: t('components.badge.name'),
        icon: '🏷️',
        category: t('categories.data'),
        description: t('components.badge.description'),
        defaultProps: {
          count: 5,
          showZero: false,
        },
        propTypes: [
          { name: 'count', type: 'number', label: t('components.badge.count'), required: false },
          { name: 'showZero', type: 'boolean', label: t('components.badge.showZero'), required: false },
        ],
      },
    ],
  },
  {
    category: t('categories.feedback'),
    components: [
      {
        type: 'divider',
        name: t('components.divider.name'),
        icon: '➖',
        category: t('categories.feedback'),
        description: t('components.divider.description'),
        defaultProps: {
          type: 'horizontal',
          orientation: 'center',
        },
        propTypes: [
          { name: 'type', type: 'select', label: t('components.divider.type'), options: [
            { label: t('components.divider.types.horizontal'), value: 'horizontal' },
            { label: t('components.divider.types.vertical'), value: 'vertical' },
          ] },
          { name: 'orientation', type: 'select', label: t('components.divider.orientation'), options: [
            { label: t('components.divider.orientations.left'), value: 'left' },
            { label: t('components.divider.orientations.center'), value: 'center' },
            { label: t('components.divider.orientations.right'), value: 'right' },
          ] },
        ],
      },
    ],
  },
];
