import React from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  ColorPicker,
  Button,
  Space,
  Divider,
} from 'antd';
import { SaveOutlined, UndoOutlined } from '@ant-design/icons';
import type { ComponentConfig } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface EmailPropertyPanelProps {
  selectedComponent: ComponentConfig | null;
  onUpdateComponent: (id: string, props: Record<string, any>) => void;
}

export const EmailPropertyPanel: React.FC<EmailPropertyPanelProps> = ({
  selectedComponent,
  onUpdateComponent,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (selectedComponent) {
      form.setFieldsValue(selectedComponent.props);
    }
  }, [selectedComponent, form]);

  const handleSave = (values: any) => {
    if (selectedComponent) {
      onUpdateComponent(selectedComponent.id, values);
    }
  };

  const handleReset = () => {
    if (selectedComponent) {
      form.setFieldsValue(selectedComponent.props);
    }
  };

  if (!selectedComponent) {
    return (
      <Card title="属性配置" style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px',
            color: '#999',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <div>请选择一个邮件组件来编辑属性</div>
        </div>
      </Card>
    );
  }

  const renderPropertyFields = () => {
    switch (selectedComponent.type) {
      case 'email-header':
        return (
          <>
            <Form.Item label="Logo图片" name="logo">
              <Input placeholder="输入Logo图片URL" />
            </Form.Item>
            <Form.Item
              label="公司名称"
              name="companyName"
              rules={[{ required: true }]}
            >
              <Input placeholder="输入公司名称" />
            </Form.Item>
            <Form.Item label="公司标语" name="tagline">
              <Input placeholder="输入公司标语" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 20px" />
            </Form.Item>
          </>
        );

      case 'email-title':
        return (
          <>
            <Form.Item label="标题" name="title" rules={[{ required: true }]}>
              <Input placeholder="输入邮件标题" />
            </Form.Item>
            <Form.Item label="副标题" name="subtitle">
              <Input placeholder="输入副标题" />
            </Form.Item>
            <Form.Item label="对齐方式" name="textAlign">
              <Select>
                <Option value="left">左对齐</Option>
                <Option value="center">居中</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
            <Form.Item label="字体大小" name="fontSize">
              <Input placeholder="如: 24px" />
            </Form.Item>
            <Form.Item label="文字颜色" name="color">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 30px 20px" />
            </Form.Item>
          </>
        );

      case 'email-content':
        return (
          <>
            <Form.Item label="内容" name="content" rules={[{ required: true }]}>
              <TextArea rows={4} placeholder="输入邮件内容，支持HTML" />
            </Form.Item>
            <Form.Item label="对齐方式" name="textAlign">
              <Select>
                <Option value="left">左对齐</Option>
                <Option value="center">居中</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
            <Form.Item label="行高" name="lineHeight">
              <Input placeholder="如: 1.6" />
            </Form.Item>
            <Form.Item label="文字颜色" name="color">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 30px 20px" />
            </Form.Item>
          </>
        );

      case 'email-button':
        return (
          <>
            <Form.Item
              label="按钮文字"
              name="text"
              rules={[{ required: true }]}
            >
              <Input placeholder="输入按钮文字" />
            </Form.Item>
            <Form.Item label="链接地址" name="url" rules={[{ required: true }]}>
              <Input placeholder="输入链接地址" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="文字颜色" name="textColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="圆角" name="borderRadius">
              <Input placeholder="如: 4px" />
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 12px 24px" />
            </Form.Item>
            <Form.Item label="字体大小" name="fontSize">
              <Input placeholder="如: 16px" />
            </Form.Item>
            <Form.Item label="对齐方式" name="textAlign">
              <Select>
                <Option value="left">左对齐</Option>
                <Option value="center">居中</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
          </>
        );

      case 'email-image':
        return (
          <>
            <Form.Item label="图片地址" name="src" rules={[{ required: true }]}>
              <Input placeholder="输入图片URL" />
            </Form.Item>
            <Form.Item label="替代文本" name="alt">
              <Input placeholder="输入图片描述" />
            </Form.Item>
            <Form.Item label="宽度" name="width">
              <Input placeholder="如: 100%" />
            </Form.Item>
            <Form.Item label="最大宽度" name="maxWidth">
              <Input placeholder="如: 600px" />
            </Form.Item>
            <Form.Item label="高度" name="height">
              <Input placeholder="如: auto" />
            </Form.Item>
            <Form.Item label="对齐方式" name="textAlign">
              <Select>
                <Option value="left">左对齐</Option>
                <Option value="center">居中</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 20px" />
            </Form.Item>
          </>
        );

      case 'email-banner':
        return (
          <>
            <Form.Item label="标题" name="title" rules={[{ required: true }]}>
              <Input placeholder="输入横幅标题" />
            </Form.Item>
            <Form.Item label="副标题" name="subtitle">
              <Input placeholder="输入副标题" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="文字颜色" name="textColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="字体大小" name="fontSize">
              <Input placeholder="如: 20px" />
            </Form.Item>
            <Form.Item label="对齐方式" name="textAlign">
              <Select>
                <Option value="left">左对齐</Option>
                <Option value="center">居中</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 40px 20px" />
            </Form.Item>
          </>
        );

      case 'email-product':
        return (
          <>
            <Form.Item
              label="产品名称"
              name="productName"
              rules={[{ required: true }]}
            >
              <Input placeholder="输入产品名称" />
            </Form.Item>
            <Form.Item label="产品描述" name="productDescription">
              <TextArea rows={3} placeholder="输入产品描述" />
            </Form.Item>
            <Form.Item label="产品价格" name="productPrice">
              <Input placeholder="如: ¥99.00" />
            </Form.Item>
            <Form.Item label="产品图片" name="productImage">
              <Input placeholder="输入产品图片URL" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="边框" name="border">
              <Input placeholder="如: 1px solid #e9ecef" />
            </Form.Item>
            <Form.Item label="圆角" name="borderRadius">
              <Input placeholder="如: 8px" />
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 20px" />
            </Form.Item>
          </>
        );

      case 'email-two-column':
        return (
          <>
            <Form.Item label="左侧内容" name="leftContent">
              <TextArea rows={4} placeholder="输入左侧内容，支持HTML" />
            </Form.Item>
            <Form.Item label="右侧内容" name="rightContent">
              <TextArea rows={4} placeholder="输入右侧内容，支持HTML" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="列间距" name="columnGap">
              <Input placeholder="如: 20px" />
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 20px" />
            </Form.Item>
          </>
        );

      case 'email-three-column':
        return (
          <>
            <Form.Item label="左侧内容" name="leftContent">
              <TextArea rows={3} placeholder="输入左侧内容，支持HTML" />
            </Form.Item>
            <Form.Item label="中间内容" name="centerContent">
              <TextArea rows={3} placeholder="输入中间内容，支持HTML" />
            </Form.Item>
            <Form.Item label="右侧内容" name="rightContent">
              <TextArea rows={3} placeholder="输入右侧内容，支持HTML" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="列间距" name="columnGap">
              <Input placeholder="如: 15px" />
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 20px" />
            </Form.Item>
          </>
        );

      case 'email-social':
        return (
          <>
            <Form.Item label="Facebook链接" name="facebook">
              <Input placeholder="输入Facebook链接" />
            </Form.Item>
            <Form.Item label="Twitter链接" name="twitter">
              <Input placeholder="输入Twitter链接" />
            </Form.Item>
            <Form.Item label="Instagram链接" name="instagram">
              <Input placeholder="输入Instagram链接" />
            </Form.Item>
            <Form.Item label="LinkedIn链接" name="linkedin">
              <Input placeholder="输入LinkedIn链接" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="对齐方式" name="textAlign">
              <Select>
                <Option value="left">左对齐</Option>
                <Option value="center">居中</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 20px" />
            </Form.Item>
          </>
        );

      case 'email-footer':
        return (
          <>
            <Form.Item
              label="脚部内容"
              name="content"
              rules={[{ required: true }]}
            >
              <TextArea rows={3} placeholder="输入脚部内容，支持HTML" />
            </Form.Item>
            <Form.Item label="背景颜色" name="backgroundColor">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="文字颜色" name="color">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="字体大小" name="fontSize">
              <Input placeholder="如: 12px" />
            </Form.Item>
            <Form.Item label="对齐方式" name="textAlign">
              <Select>
                <Option value="left">左对齐</Option>
                <Option value="center">居中</Option>
                <Option value="right">右对齐</Option>
              </Select>
            </Form.Item>
            <Form.Item label="内边距" name="padding">
              <Input placeholder="如: 20px" />
            </Form.Item>
          </>
        );

      case 'email-divider':
        return (
          <>
            <Form.Item label="分割线颜色" name="color">
              <ColorPicker showText />
            </Form.Item>
            <Form.Item label="分割线高度" name="height">
              <Input placeholder="如: 1px" />
            </Form.Item>
            <Form.Item label="外边距" name="margin">
              <Input placeholder="如: 20px 0" />
            </Form.Item>
            <Form.Item label="宽度" name="width">
              <Input placeholder="如: 100%" />
            </Form.Item>
          </>
        );

      default:
        return (
          <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
            该组件暂无属性配置
          </div>
        );
    }
  };

  return (
    <Card
      title={`属性配置 - ${selectedComponent.name}`}
      style={{ height: '100%' }}
      bodyStyle={{ height: 'calc(100% - 57px)', overflow: 'auto' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        style={{ height: '100%' }}
      >
        {renderPropertyFields()}

        <Divider />

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button icon={<UndoOutlined />} onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
            保存
          </Button>
        </Space>
      </Form>
    </Card>
  );
};
