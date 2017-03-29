/**
 * 向字符串左侧填充指定长度的内容
 *
 * @export
 * @param {*} source 需要填充的字符串
 * @param {number} num 填充后的长度
 * @param {*} [fill=''] 填充的内容，默认为空格
 * @returns {string} 填充后的字符串
 */
export function padRight(source: any, num: number, fill: any = ''): string {
  if (typeof source !== 'string') source = source.toString()
  if (source.length >= num) return source
  if (typeof fill !== 'string') fill = fill.toString()

  return source.concat(fill.repeat(num - source.length))
}
