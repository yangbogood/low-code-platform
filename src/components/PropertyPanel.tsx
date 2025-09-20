import React from 'react';
import { Card, Form, Input, InputNumber, Switch, Select, ColorPicker, Space, Typography, Divider } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ComponentConfig, PropType } from '../types';
import { useEditor } from '../context/EditorContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface PropertyPanelProps {
  component: ComponentConfig | null;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({ component }) => {
  const { dispatch } = useEditor();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (component) {
      form.setFieldsValue(component.props);
    }
  }, [component, form]);

  const handlePropertyChange = (changedValues: any) => {
    if (!component) {return;}

    dispatch({
      type: 'UPDATE_COMPONENT',
      payload: {
        id: component.id,
        props: changedValues,
      },
    });
  };

  const renderPropertyField = (prop: PropType) => {
    const { name, type, label, options } = prop;

    switch (type) {
      case 'string':
        return (
          <Form.Item key={name} name={name} label={label}>
            <Input placeholder={t('placeholders.enterText', { label })} />
          </Form.Item>
        );

      case 'textarea':
        return (
          <Form.Item key={name} name={name} label={label}>
            <TextArea rows={3} placeholder={t('placeholders.enterText', { label })} />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item key={name} name={name} label={label}>
            <InputNumber style={{ width: '100%' }} placeholder={t('placeholders.enterText', { label })} />
          </Form.Item>
        );

      case 'boolean':
        return (
          <Form.Item key={name} name={name} label={label} valuePropName="checked">
            <Switch />
          </Form.Item>
        );

      case 'select':
        return (
          <Form.Item key={name} name={name} label={label}>
            <Select placeholder={t('placeholders.selectOption', { label })}>
              {options?.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );

      case 'color':
        return (
          <Form.Item key={name} name={name} label={label}>
            <ColorPicker showText />
          </Form.Item>
        );

      default:
        return null;
    }
  };

  if (!component) {
    return (
      <div className="property-panel">
        <div className="property-panel-empty">
          <Text type="secondary">{t('placeholders.selectComponent')}</Text>
        </div>
      </div>
    );
  }

  // 根据组件类型获取属性配置
  const getComponentProperties = (componentType: string): PropType[] => {
    const propertyMap: Record<string, PropType[]> = {
      button: [
        { name: 'text', type: 'string', label: '按钮文本', defaultValue: '按钮' },
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
        { name: 'disabled', type: 'boolean', label: '禁用状态', defaultValue: false },
      ],
      input: [
        { name: 'placeholder', type: 'string', label: '占位符', defaultValue: '请输入内容' },
        { name: 'size', type: 'select', label: '输入框大小', options: [
          { label: '小', value: 'small' },
          { label: '中', value: 'middle' },
          { label: '大', value: 'large' },
        ] },
        { name: 'disabled', type: 'boolean', label: '禁用状态', defaultValue: false },
      ],
      text: [
        { name: 'content', type: 'string', label: '文本内容', defaultValue: '文本内容' },
        { name: 'color', type: 'color', label: '文字颜色' },
        { name: 'fontSize', type: 'number', label: '字体大小' },
      ],
      title: [
        { name: 'content', type: 'string', label: '标题内容', defaultValue: '标题' },
        { name: 'level', type: 'select', label: '标题级别', options: [
          { label: 'H1', value: 1 },
          { label: 'H2', value: 2 },
          { label: 'H3', value: 3 },
          { label: 'H4', value: 4 },
          { label: 'H5', value: 5 },
        ] },
        { name: 'color', type: 'color', label: '文字颜色' },
      ],
      paragraph: [
        { name: 'content', type: 'textarea', label: '段落内容', defaultValue: '段落内容' },
        { name: 'color', type: 'color', label: '文字颜色' },
      ],
      card: [
        { name: 'title', type: 'string', label: '卡片标题', defaultValue: '卡片标题' },
        { name: 'content', type: 'textarea', label: '卡片内容', defaultValue: '卡片内容' },
        { name: 'bordered', type: 'boolean', label: '显示边框', defaultValue: true },
      ],
      image: [
        { name: 'src', type: 'string', label: '图片地址', defaultValue: 'https://via.placeholder.com/200x150' },
        { name: 'alt', type: 'string', label: '替代文本', defaultValue: '图片' },
        { name: 'width', type: 'number', label: '宽度', defaultValue: 200 },
        { name: 'height', type: 'number', label: '高度', defaultValue: 150 },
      ],
      container: [
        { name: 'backgroundColor', type: 'color', label: '背景颜色' },
        { name: 'padding', type: 'number', label: '内边距', defaultValue: 16 },
        { name: 'margin', type: 'number', label: '外边距', defaultValue: 0 },
      ],
      textarea: [
        { name: 'placeholder', type: 'string', label: '占位符', defaultValue: '请输入内容' },
        { name: 'rows', type: 'number', label: '行数', defaultValue: 4 },
        { name: 'disabled', type: 'boolean', label: '禁用状态', defaultValue: false },
      ],
      select: [
        { name: 'placeholder', type: 'string', label: '占位符', defaultValue: '请选择' },
        { name: 'disabled', type: 'boolean', label: '禁用状态', defaultValue: false },
      ],
      switch: [
        { name: 'checked', type: 'boolean', label: '是否选中', defaultValue: false },
        { name: 'disabled', type: 'boolean', label: '禁用状态', defaultValue: false },
      ],
      divider: [
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
      badge: [
        { name: 'count', type: 'number', label: '徽标数', defaultValue: 5 },
        { name: 'showZero', type: 'boolean', label: '显示零值', defaultValue: false },
      ],
    };

    return propertyMap[componentType] || [];
  };

  const properties = getComponentProperties(component.type);

  return (
    <div className="property-panel">
      <Title className="property-panel-title" level={4}>{t('sidebar.propertyPanel')}</Title>
      <Divider />

      <Card size="small" className="component-info">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text strong>组件信息</Text>
          <div className="component-info-item">
            <span className="component-info-item-label">类型:</span>
            <span className="component-info-item-value">{component.type}</span>
          </div>
          <div className="component-info-item">
            <span className="component-info-item-label">名称:</span>
            <span className="component-info-item-value">{component.name}</span>
          </div>
          <div className="component-info-item">
            <span className="component-info-item-label">ID:</span>
            <span className="component-info-item-value">{component.id}</span>
          </div>
        </Space>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handlePropertyChange}
        size="small"
      >
        {properties.map(renderPropertyField)}
      </Form>

      <Divider />

      <div className="property-panel-section">
        <div className="property-panel-section-title">
          <Text strong>样式配置</Text>
        </div>
        <Form.Item name="style" label="自定义样式">
          <TextArea
            rows={3}
            placeholder="CSS样式，如: { color: 'red', fontSize: '16px' }"
          />
        </Form.Item>
      </div>
    </div>
  );
};
