/**
 * ID生成器工具函数
 * 生成复杂的唯一ID，包含时间戳、随机字符串和类型标识
 */

/**
 * 生成项目ID
 * 格式: project_{timestamp}_{randomString}
 */
export const generateProjectId = (): string => {
  return `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 生成页面ID
 * 格式: page_{timestamp}_{randomString}
 */
export const generatePageId = (): string => {
  return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 生成组件ID
 * 格式: component_{timestamp}_{randomString}_{componentType}
 */
export const generateComponentId = (componentType: string): string => {
  return `component_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${componentType}`;
};

/**
 * 生成通用唯一ID
 * 格式: {prefix}_{timestamp}_{randomString}
 */
export const generateUniqueId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 生成带序号和类型的复杂ID
 * 格式: {prefix}_{timestamp}_{randomString}_{type}_{index}
 */
export const generateComplexId = (
  prefix: string,
  type: string,
  index?: number,
): string => {
  const baseId = `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${type}`;
  return index !== undefined ? `${baseId}_${index}` : baseId;
};

/**
 * 生成UUID风格的ID（更复杂）
 * 格式: {prefix}-{timestamp}-{random1}-{random2}-{random3}
 */
export const generateUUIDStyleId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const random1 = Math.random().toString(36).substr(2, 4);
  const random2 = Math.random().toString(36).substr(2, 4);
  const random3 = Math.random().toString(36).substr(2, 4);

  return `${prefix}-${timestamp}-${random1}-${random2}-${random3}`;
};
