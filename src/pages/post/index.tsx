import { View, Input, Textarea, Picker } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import React from 'react'

interface PostForm {
  title: string
  content: string
  location: {
    name: string
    address: string
    latitude: number
    longitude: number
  } | null
  images: string[]
  tags: string[]
  timeSlots: string[]
}

export default function Post() {
  // 获取系统信息
  const [systemInfo] = useState(() => Taro.getSystemInfoSync())
  const safeAreaTop = systemInfo?.safeArea?.top || 0
  const safeAreaBottom = systemInfo?.safeArea?.bottom ? (systemInfo.windowHeight - systemInfo.safeArea.bottom) : 34

  // 表单状态
  const [form, setForm] = useState<PostForm>({
    title: '',
    content: '',
    location: null,
    images: [],
    tags: [],
    timeSlots: []
  })

  // 可选标签列表
  const availableTags = ['咖啡', '美食', '探店', '购物', '娱乐', '文化']

  // 添加自定义标签输入状态
  const [customTagInput, setCustomTagInput] = useState('')

  // 修改时间段输入状态的类型
  const [timeSlotInput, setTimeSlotInput] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  })

  // 选择位置
  const handleChooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation()
      setForm(prev => ({
        ...prev,
        location: {
          name: res.name,
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        }
      }))
    } catch (error) {
      console.error('选择位置失败:', error)
    }
  }

  // 选择图片
  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({
        count: 9 - form.images.length,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      })
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...res.tempFilePaths]
      }))
    } catch (error) {
      console.error('选择图片失败:', error)
    }
  }

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // 切换标签
  const handleToggleTag = (tag: string) => {
    setForm(prev => {
      // 如果标签已存在，则移除
      if (prev.tags.includes(tag)) {
        return {
          ...prev,
          tags: prev.tags.filter(t => t !== tag)
        }
      }
      // 如果标签不存在且数量小于3，则添加
      if (prev.tags.length < 3) {
        return {
          ...prev,
          tags: [...prev.tags, tag]
        }
      }
      // 如果已有3个标签，显示提示
      Taro.showToast({
        title: '最多选择3个标签',
        icon: 'none'
      })
      return prev
    })
  }

  // 添加自定义标签
  const handleAddCustomTag = () => {
    const tag = customTagInput.trim()
    if (tag) {
      if (form.tags.includes(tag)) {
        Taro.showToast({
          title: '标签已存在',
          icon: 'none'
        })
      } else if (form.tags.length >= 3) {
        Taro.showToast({
          title: '最多选择3个标签',
          icon: 'none'
        })
      } else {
        setForm(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }))
        setCustomTagInput('') // 清空输入
      }
    }
  }

  // 修改添加时间段的处理函数
  const handleAddTimeSlot = () => {
    const { startDate, startTime, endDate, endTime } = timeSlotInput
    if (!startDate || !startTime || !endDate || !endTime) {
      return Taro.showToast({
        title: '请输入完整的时间段',
        icon: 'none'
      })
    }

    const timeSlot = `${startDate} ${startTime}-${endDate} ${endTime}`
    if (form.timeSlots.includes(timeSlot)) {
      return Taro.showToast({
        title: '该时间段已存在',
        icon: 'none'
      })
    }

    setForm(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, timeSlot]
    }))
    setTimeSlotInput({ startDate: '', startTime: '', endDate: '', endTime: '' }) // 清空输入
  }

  // 删除时间段
  const handleRemoveTimeSlot = (index: number) => {
    setForm(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }))
  }

  // 发布帖子
  const handleSubmit = () => {
    if (!form.title.trim()) {
      return Taro.showToast({
        title: '请输入标题',
        icon: 'none'
      })
    }
    if (!form.content.trim()) {
      return Taro.showToast({
        title: '请输入内容',
        icon: 'none'
      })
    }
    if (!form.location) {
      return Taro.showToast({
        title: '请选择位置',
        icon: 'none'
      })
    }
    
    // TODO: 实现发布逻辑
    console.log('发布帖子:', form)
    Taro.showToast({
      title: '发布成功',
      icon: 'success'
    })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  }

  return (
    <View style={{
      // minHeight: '100vh',
      background: '#FFFAF0',
      paddingBottom: '20px',
      paddingTop: `${safeAreaTop / 2}px`
    }}>
      {/* 内容区域 - 不再需要额外的顶部内边距 */}
      <View>
        {/* 图片上传 */}
        <View style={{
          margin: '0px 16px 16px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '2px solid #2D2D2D',
          padding: '16px'
        }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            图片
          </View>
          <View style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            {form.images.map((image, index) => (
              <View
                key={index}
                style={{ position: 'relative' }}
              >
                <Image
                  src={image}
                  mode='aspectFill'
                  style={{
                    width: '100%',
                    height: '100px',
                    borderRadius: '8px',
                    border: '2px solid #2D2D2D'
                  }}
                />
                <View
                  onClick={() => handleRemoveImage(index)}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    width: '24px',
                    height: '24px',
                    background: '#FF4B4B',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    border: '2px solid #2D2D2D'
                  }}
                >
                  ×
                </View>
              </View>
            ))}
            {form.images.length < 9 && (
              <View
                onClick={handleChooseImage}
                style={{
                  width: '100%',
                  height: '100px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  border: '2px dashed #2D2D2D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  color: '#999'
                }}
              >
                +
              </View>
            )}
          </View>
        </View>

        {/* 标题输入 */}
        <View style={{
          margin: '16px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '2px solid #2D2D2D',
          padding: '16px'
        }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            标题
          </View>
          <Input
            value={form.title}
            onInput={e => setForm(prev => ({ ...prev, title: e.detail.value }))}
            placeholder='添加标题'
            placeholderStyle='color: #999'
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2D2D2D'
            }}
          />
        </View>

        {/* 内容输入 */}
        <View style={{
          margin: '16px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '2px solid #2D2D2D',
          padding: '16px'
        }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            内容
          </View>
          <Textarea
            value={form.content}
            onInput={e => setForm(prev => ({ ...prev, content: e.detail.value }))}
            placeholder='分享你的发现...'
            placeholderStyle='color: #999'
            style={{
              width: '100%',
              minHeight: '120px',
              fontSize: '16px',
              color: '#333',
              lineHeight: 1.6
            }}
          />
        </View>

        {/* 位置选择 */}
        <View
          onClick={handleChooseLocation}
          style={{
            margin: '16px',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '2px solid #2D2D2D',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >

          {form.location ? (
            <View style={{ flex: 1 }}>
              <View style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#2D2D2D',
                marginBottom: '4px'
              }}>
                {form.location.name}
              </View>
              <View style={{
                fontSize: '14px',
                color: '#666666'
              }}>
                {form.location.address}
              </View>
            </View>
          ) : (
            <View style={{
              flex: 1,
              fontSize: '16px',
              color: '#999'
            }}>
              添加位置
            </View>
          )}
        </View>

        {/* 在线时间选择器 */}
        <View style={{
          margin: '16px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '2px solid #2D2D2D',
          padding: '16px'
        }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            在线时间
          </View>
          {/* 时间选择器 */}
          <View style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '16px'
          }}>
            {/* 开始时间 */}
            <View style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <View style={{
                fontSize: '14px',
                color: '#666',
                width: '60px'
              }}>
                开始
              </View>
              <Picker
                mode='date'
                value={timeSlotInput.startDate}
                onChange={e => setTimeSlotInput(prev => ({ ...prev, startDate: e.detail.value }))}
                style={{ flex: 1 }}
              >
                <View style={{
                  fontSize: '14px',
                  padding: '8px 12px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  border: '1.5px solid #2D2D2D',
                  color: timeSlotInput.startDate ? '#333' : '#999'
                }}>
                  {timeSlotInput.startDate || '选择日期'}
                </View>
              </Picker>
              <Picker
                mode='time'
                value={timeSlotInput.startTime}
                onChange={e => setTimeSlotInput(prev => ({ ...prev, startTime: e.detail.value }))}
                style={{ flex: 1 }}
              >
                <View style={{
                  fontSize: '14px',
                  padding: '8px 12px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  border: '1.5px solid #2D2D2D',
                  color: timeSlotInput.startTime ? '#333' : '#999'
                }}>
                  {timeSlotInput.startTime || '选择时间'}
                </View>
              </Picker>
            </View>

            {/* 结束时间 */}
            <View style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <View style={{
                fontSize: '14px',
                color: '#666',
                width: '60px'
              }}>
                结束
              </View>
              <Picker
                mode='date'
                value={timeSlotInput.endDate}
                onChange={e => setTimeSlotInput(prev => ({ ...prev, endDate: e.detail.value }))}
                style={{ flex: 1 }}
              >
                <View style={{
                  fontSize: '14px',
                  padding: '8px 12px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  border: '1.5px solid #2D2D2D',
                  color: timeSlotInput.endDate ? '#333' : '#999'
                }}>
                  {timeSlotInput.endDate || '选择日期'}
                </View>
              </Picker>
              <Picker
                mode='time'
                value={timeSlotInput.endTime}
                onChange={e => setTimeSlotInput(prev => ({ ...prev, endTime: e.detail.value }))}
                style={{ flex: 1 }}
              >
                <View style={{
                  fontSize: '14px',
                  padding: '8px 12px',
                  background: '#F5F5F5',
                  borderRadius: '8px',
                  border: '1.5px solid #2D2D2D',
                  color: timeSlotInput.endTime ? '#333' : '#999'
                }}>
                  {timeSlotInput.endTime || '选择时间'}
                </View>
              </Picker>
            </View>

            {/* 添加按钮 */}
            <View
              onClick={handleAddTimeSlot}
              style={{
                padding: '8px',
                borderRadius: '8px',
                border: '1.5px solid #2D2D2D',
                background: '#FFE4CC',
                fontSize: '14px',
                color: '#2D2D2D',
                textAlign: 'center'
              }}
            >
              添加时间段
            </View>
          </View>

          {/* 已添加的时间段列表 */}
          {form.timeSlots.length > 0 && (
            <View style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {form.timeSlots.map((timeSlot, index) => (
                <View
                  key={index}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #2D2D2D',
                    background: '#F0FFF0',
                    fontSize: '14px',
                    color: '#2D2D2D',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <View style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <View>{timeSlot}</View>
                  </View>
                  <View
                    onClick={() => handleRemoveTimeSlot(index)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '10px',
                      background: '#FF4B4B',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #2D2D2D'
                    }}
                  >
                    ×
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 标签选择 */}
        <View style={{
          margin: '16px',
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '2px solid #2D2D2D',
          padding: '16px'
        }}>
          <View style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '12px'
          }}>
            标签
          </View>
          {/* 自定义标签输入 */}
          <View style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <Input
              value={customTagInput}
              onInput={e => setCustomTagInput(e.detail.value)}
              placeholder='添加自定义标签'
              placeholderStyle='color: #999'
              onConfirm={handleAddCustomTag}
              style={{
                flex: 1,
                fontSize: '14px',
                padding: '6px 12px',
                background: '#F5F5F5',
                borderRadius: '12px',
                border: '2px solid #2D2D2D'
              }}
            />
            <View
              onClick={handleAddCustomTag}
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                border: '2px solid #2D2D2D',
                background: '#FFE4CC',
                fontSize: '14px',
                color: '#2D2D2D'
              }}
            >
              添加
            </View>
          </View>

          {/* 已选标签展示 */}
          <View style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {/* 推荐标签 */}
            {availableTags.map(tag => (
              <View
                key={tag}
                onClick={() => handleToggleTag(tag)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  border: '2px solid #2D2D2D',
                  background: form.tags.includes(tag) ? '#FFE4CC' : '#FFFFFF',
                  fontSize: '14px',
                  color: '#2D2D2D',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <View>{tag}</View>
                {form.tags.includes(tag) && (
                  <View
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleTag(tag)
                    }}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '8px',
                      background: '#FF4B4B',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #2D2D2D'
                    }}
                  >
                    ×
                  </View>
                )}
              </View>
            ))}

            {/* 自定义标签 */}
            {form.tags
              .filter(tag => !availableTags.includes(tag))
              .map(tag => (
                <View
                  key={tag}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    border: '2px solid #2D2D2D',
                    background: '#FFE4CC',
                    fontSize: '14px',
                    color: '#2D2D2D',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <View>{tag}</View>
                  <View
                    onClick={() => handleToggleTag(tag)}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '8px',
                      background: '#FF4B4B',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1.5px solid #2D2D2D'
                    }}
                  >
                    ×
                  </View>
                </View>
              ))}
          </View>
        </View>
      </View>

      {/* 底部固定按钮 */}
      <View style={{
        padding: '16px',
        background: '#FFFAF0',
        borderTop: '1px solid #EAEAEA',
        display: 'flex',
        gap: '12px',
      }}>
        {/* 取消按钮 */}
        <View
          onClick={() => {
            Taro.navigateBack()
          }}
          style={{
            flex: 1,
            padding: '12px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '2px solid #2D2D2D',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2D2D2D'
          }}
        >
          取消
        </View>

        {/* 发布按钮 */}
        <View
          onClick={handleSubmit}
          style={{
            flex: 2,
            padding: '12px',
            background: '#FF4B4B',
            borderRadius: '12px',
            border: '2px solid #2D2D2D',
            textAlign: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#FFFFFF'
          }}
        >
          发布
        </View>
      </View>
    </View>
  )
}

// 添加页面配置
definePageConfig({
  navigationBarTitleText: '发布',
  navigationBarBackgroundColor: '#FFFAF0',
  navigationBarTextStyle: 'black',
  backgroundColor: '#FFFAF0'
}) 