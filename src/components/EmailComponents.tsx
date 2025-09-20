import React from 'react';
import type { ComponentConfig } from '../types';

// 邮件头部组件
export const EmailHeader: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { logo, companyName, tagline, backgroundColor, padding } = component.props;

  return (
    <div style={{
      backgroundColor,
      padding,
      textAlign: 'center' as const,
      borderBottom: '1px solid #e9ecef',
    }}>
      {logo && (
        <img
          src={logo}
          alt={companyName}
          style={{
            maxHeight: '60px',
            marginBottom: '10px',
          }}
        />
      )}
      <h1 style={{
        margin: '0 0 5px 0',
        fontSize: '24px',
        color: '#333333',
      }}>
        {companyName}
      </h1>
      {tagline && (
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: '#666666',
        }}>
          {tagline}
        </p>
      )}
    </div>
  );
};

// 邮件标题组件
export const EmailTitle: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { title, subtitle, textAlign, color, fontSize, backgroundColor, padding } = component.props;

  return (
    <div style={{
      backgroundColor,
      padding,
      textAlign: textAlign as any,
    }}>
      <h2 style={{
        margin: '0 0 10px 0',
        fontSize,
        color,
        fontWeight: 'bold',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          margin: '0',
          fontSize: '16px',
          color: '#666666',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

// 邮件内容组件
export const EmailContent: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { content, backgroundColor, padding, textAlign, lineHeight, color } = component.props;

  return (
    <div style={{
      backgroundColor,
      padding,
      textAlign: textAlign as any,
      lineHeight,
      color,
    }}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

// 邮件按钮组件
export const EmailButton: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const {
    text,
    url,
    backgroundColor,
    textColor,
    borderRadius,
    padding,
    fontSize,
    textAlign,
  } = component.props;

  return (
    <div style={{
      textAlign: textAlign as any,
      padding: '20px',
    }}>
      <a
        href={url}
        style={{
          display: 'inline-block',
          backgroundColor,
          color: textColor,
          padding,
          borderRadius,
          fontSize,
          textDecoration: 'none',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.opacity = '0.9';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
      >
        {text}
      </a>
    </div>
  );
};

// 邮件图片组件
export const EmailImage: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { src, alt, width, maxWidth, height, textAlign, padding } = component.props;

  return (
    <div style={{
      textAlign: textAlign as any,
      padding,
    }}>
      <img
        src={src}
        alt={alt}
        style={{
          width,
          maxWidth,
          height,
          display: 'block',
          margin: '0 auto',
        }}
      />
    </div>
  );
};

// 邮件分割线组件
export const EmailDivider: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { color, height, margin, width } = component.props;

  return (
    <div style={{
      width,
      height,
      backgroundColor: color,
      margin,
    }} />
  );
};

// 邮件脚部组件
export const EmailFooter: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { content, backgroundColor, padding, textAlign, fontSize, color } = component.props;

  return (
    <div style={{
      backgroundColor,
      padding,
      textAlign: textAlign as any,
      fontSize,
      color,
      borderTop: '1px solid #e9ecef',
    }}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

// 邮件两列布局组件
export const EmailTwoColumn: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { leftContent, rightContent, backgroundColor, padding, columnGap } = component.props;

  return (
    <div style={{
      backgroundColor,
      padding,
      width: '100%',
      boxSizing: 'border-box',
      minHeight: '120px',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        maxWidth: '100%',
        margin: 0,
      }}>
        <tbody>
          <tr>
            <td style={{
              width: '50%',
              paddingRight: columnGap,
              verticalAlign: 'top',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              boxSizing: 'border-box',
            }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
                dangerouslySetInnerHTML={{ __html: leftContent }}
              />
            </td>
            <td style={{
              width: '50%',
              paddingLeft: columnGap,
              verticalAlign: 'top',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              boxSizing: 'border-box',
            }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
                dangerouslySetInnerHTML={{ __html: rightContent }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// 邮件三列布局组件
export const EmailThreeColumn: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { leftContent, centerContent, rightContent, backgroundColor, padding, columnGap } = component.props;

  return (
    <div style={{
      backgroundColor,
      padding,
      width: '100%',
      boxSizing: 'border-box',
      minHeight: '120px',
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed',
        maxWidth: '100%',
        margin: 0,
      }}>
        <tbody>
          <tr>
            <td style={{
              width: '33.33%',
              paddingRight: columnGap,
              verticalAlign: 'top',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              boxSizing: 'border-box',
            }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
                dangerouslySetInnerHTML={{ __html: leftContent }}
              />
            </td>
            <td style={{
              width: '33.33%',
              paddingLeft: columnGap,
              paddingRight: columnGap,
              verticalAlign: 'top',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              boxSizing: 'border-box',
            }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
                dangerouslySetInnerHTML={{ __html: centerContent }}
              />
            </td>
            <td style={{
              width: '33.33%',
              paddingLeft: columnGap,
              verticalAlign: 'top',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              boxSizing: 'border-box',
            }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
                dangerouslySetInnerHTML={{ __html: rightContent }}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// 邮件促销横幅组件
export const EmailBanner: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { title, subtitle, backgroundColor, textColor, padding, textAlign, fontSize } = component.props;

  return (
    <div style={{
      backgroundColor,
      color: textColor,
      padding,
      textAlign: textAlign as any,
    }}>
      <h2 style={{
        margin: '0 0 10px 0',
        fontSize,
        fontWeight: 'bold',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          margin: '0',
          fontSize: '16px',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

// 邮件产品展示组件
export const EmailProduct: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const {
    productName,
    productDescription,
    productPrice,
    productImage,
    backgroundColor,
    padding,
    border,
    borderRadius,
  } = component.props;

  return (
    <div style={{
      backgroundColor,
      padding,
      border,
      borderRadius,
      textAlign: 'center' as const,
    }}>
      {productImage && (
        <img
          src={productImage}
          alt={productName}
          style={{
            width: '100%',
            maxWidth: '200px',
            height: 'auto',
            marginBottom: '15px',
          }}
        />
      )}
      <h3 style={{
        margin: '0 0 10px 0',
        fontSize: '18px',
        color: '#333333',
      }}>
        {productName}
      </h3>
      <p style={{
        margin: '0 0 15px 0',
        fontSize: '14px',
        color: '#666666',
        lineHeight: '1.5',
      }}>
        {productDescription}
      </p>
      <div style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#007bff',
      }}>
        {productPrice}
      </div>
    </div>
  );
};

// 邮件社交媒体组件
export const EmailSocial: React.FC<{ component: ComponentConfig }> = ({ component }) => {
  const { facebook, twitter, instagram, linkedin, backgroundColor, padding, textAlign } = component.props;

  const socialLinks = [
    { name: 'Facebook', url: facebook, icon: '📘' },
    { name: 'Twitter', url: twitter, icon: '🐦' },
    { name: 'Instagram', url: instagram, icon: '📷' },
    { name: 'LinkedIn', url: linkedin, icon: '💼' },
  ].filter(link => link.url && link.url !== '#');

  return (
    <div style={{
      backgroundColor,
      padding,
      textAlign: textAlign as any,
    }}>
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link.url}
          style={{
            display: 'inline-block',
            margin: '0 10px',
            fontSize: '24px',
            textDecoration: 'none',
          }}
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

// 邮件组件渲染器
export const renderEmailComponent = (component: ComponentConfig) => {
  switch (component.type) {
    case 'email-header':
      return <EmailHeader component={component} />;
    case 'email-title':
      return <EmailTitle component={component} />;
    case 'email-content':
      return <EmailContent component={component} />;
    case 'email-button':
      return <EmailButton component={component} />;
    case 'email-image':
      return <EmailImage component={component} />;
    case 'email-divider':
      return <EmailDivider component={component} />;
    case 'email-footer':
      return <EmailFooter component={component} />;
    case 'email-two-column':
      return <EmailTwoColumn component={component} />;
    case 'email-three-column':
      return <EmailThreeColumn component={component} />;
    case 'email-banner':
      return <EmailBanner component={component} />;
    case 'email-product':
      return <EmailProduct component={component} />;
    case 'email-social':
      return <EmailSocial component={component} />;
    default:
      return <div>未知的邮件组件类型: {component.type}</div>;
  }
};
