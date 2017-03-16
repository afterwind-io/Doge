/**
 * 向字符串左侧填充指定长度的内容
 * @param   {String}  source       需要填充的字符串
 * @param   {Number}  num          填充后的长度
 * @param   {String}  [fill='  ']  填充的内容，默认为空格
 * @return  {String}               填充后的字符串
 */
exports.padRight = function (source, num, fill = ' ') {
  if (typeof source !== 'string') source = source.toString()
  if (typeof num !== 'number') num = 0
  if (source.length >= num) return source
  if (typeof fill !== 'string') fill = fill.toString()

  return source.concat(fill.repeat(num - source.length))
}
