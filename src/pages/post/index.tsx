import { View, Input, Textarea, Button, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import React from 'react'
import { LocationIcon, PlusIcon, CloseIcon } from '../../components/Icons'

interface PostForm {
  title: string
  content: string
  images: string[]
  tags: string[]
  location?: string
}

// 预设标签列表
const PRESET_TAGS = [
  '美食探店',
  '网红打卡',
  '约会圣地',
  '家庭亲子',
  '休闲娱乐',
  '文艺小资',
  '深夜食堂',
  '早午餐'
]

export default function Post() {
  // 使用新的 API 获取窗口信息
  const windowInfo = Taro.getWindowInfo()
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
  const statusBarHeight = windowInfo.statusBarHeight || 20

  const [form, setForm] = useState<PostForm>({
    title: '',
    content: '',
    images: [],
    tags: []
  })

  const [customTag, setCustomTag] = useState('')  // 添加自定义标签输入状态
  const [isAddingTag, setIsAddingTag] = useState(false)  // 添加标签输入状态

  // 选择片
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
      console.log('选择图片失败', error)
    }
  }

  // 删除图片
  const handleRemoveImage = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // 处理发布
  const handlePublish = async () => {
    if (!form.title.trim()) {
      Taro.showToast({ title: '请输入标题', icon: 'none' })
      return
    }
    if (!form.content.trim()) {
      Taro.showToast({ title: '请输入正文', icon: 'none' })
      return
    }
    if (form.images.length === 0) {
      Taro.showToast({ title: '请至少上传一张图片', icon: 'none' })
      return
    }

    // TODO: 实现发布逻辑
    Taro.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 2000,
      complete: () => {
        setTimeout(() => {
          Taro.navigateBack()
        }, 2000)
      }
    })
  }

  // 返回上一页
  const handleBack = () => {
    Taro.navigateBack()
  }

  // 处理标签选择
  const handleTagToggle = (tag: string) => {
    setForm(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
      return { ...prev, tags }
    })
  }

  // 处理自定义标签添加
  const handleAddCustomTag = () => {
    if (!customTag.trim()) {
      Taro.showToast({
        title: '标签内容不能为空',
        icon: 'none'
      })
      return
    }

    if (form.tags.length >= 3) {
      Taro.showToast({
        title: '最多只能添加3个标签',
        icon: 'none'
      })
      return
    }

    setForm(prev => ({
      ...prev,
      tags: [...prev.tags, customTag.trim()]
    }))
    setCustomTag('')
    setIsAddingTag(false)
  }

  const handleChooseLocation = async () => {
    try {
      const res = await Taro.chooseLocation({
        success: function (res) {
          setForm(prev => ({
            ...prev,
            location: res.name
          }))
        }
      })
    } catch (error) {
      console.log('选择位置失败', error)
    }
  }

  return (
    <View style={{ 
      height: '100vh', 
      background: '#FFFAF0',
      fontFamily: '"Hiragino Kaku Gothic ProN", sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部导航栏 */}
      <View style={{
        paddingTop: `${statusBarHeight}px`,
        background: '#FFFAF0',
        borderBottom: '2px solid #2D2D2D'
      }}>
        <View style={{
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <View style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2D2D2D'
          }}>
            发布帖子
          </View>
        </View>
      </View>

      {/* 内容区域 */}
      <ScrollView
        scrollY
        style={{
          flex: 1,
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)'
        }}
      >
        <View style={{ padding: '12px' }}>
          {/* 图片上传区域 */}
          <View style={{
            marginBottom: '12px',
            padding: '12px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '2px dashed #2D2D2D'
          }}>
            <View style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              width: '100%'
            }}>
              {form.images.map((image, index) => (
                <View 
                  key={index}
                  style={{
                    position: 'relative',
                    width: 'calc((100% - 16px) / 3)',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #2D2D2D'
                  }}
                >
                  <Image
                    src={image}
                    mode='aspectFill'
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <View
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      width: '18px',
                      height: '18px',
                      background: 'rgba(0, 0, 0, 0.6)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: '12px'
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
                    width: 'calc((100% - 16px) / 3)',
                    aspectRatio: '1',
                    background: '#F5F5F5',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    border: '1px dashed #2D2D2D'
                  }}
                >
                  <View style={{ fontSize: '20px', color: '#666' }}>+</View>
                  <View style={{ fontSize: '12px', color: '#666' }}>
                    添加图片
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* 标题输入框 */}
          <View style={{
            marginBottom: '12px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '2px solid #2D2D2D',
            padding: '4px'
          }}>
            <Input 
              style={{
                fontSize: '20px',
                width: '100%',
                padding: '12px',
                color: '#2D2D2D',
                fontFamily: '"Hiragino Kaku Gothic ProN", sans-serif',
                fontWeight: '500',
                background: 'transparent',
                border: 'none'
              }}
              placeholderStyle={{
                color: '#999',
                fontSize: '16px',
                fontWeight: 'normal'
              }}
              placeholder='添加标题会获得更多赞哦'
              value={form.title}
              onInput={e => setForm(prev => ({ ...prev, title: e.detail.value }))}
              maxlength={30}
            />
          </View>

          {/* 内容输入框 */}
          <Textarea
            style={{
              width: '100%',
              minHeight: '120px',
              fontSize: '16px',
              lineHeight: '1.5',
              padding: '12px 16px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #2D2D2D',
              marginBottom: '12px',
              boxSizing: 'border-box',
              color: '#2D2D2D',
              fontFamily: '"Hiragino Kaku Gothic ProN", sans-serif'
            }}
            placeholderStyle={{
              color: '#999',
              fontSize: '14px'
            }}
            placeholder='分享你的故事...'
            value={form.content}
            onInput={e => setForm(prev => ({ ...prev, content: e.detail.value }))}
            maxlength={1000}
          />

          {/* 标签区域 */}
          <View style={{
            marginBottom: '12px'
          }}>
            <View style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '8px'
            }}>
              {form.tags.map((tag, index) => (
                <View
                  key={index}
                  onClick={() => {
                    setForm(prev => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== index)
                    }))
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: '#FF4B4B',
                    color: 'white',
                    border: '1.5px solid #2D2D2D',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {tag}
                  <View style={{ fontSize: '14px' }}>×</View>
                </View>
              ))}
              {form.tags.length < 3 && (
                <View
                  onClick={() => setIsAddingTag(true)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: '#F5F5F5',
                    color: '#666',
                    border: '1.5px solid #2D2D2D'
                  }}
                >
                  + 添加标签
                </View>
              )}
            </View>

            {/* 预设标签列表 */}
            {!isAddingTag && form.tags.length < 3 && (
              <View style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {PRESET_TAGS.filter(tag => !form.tags.includes(tag)).map((tag, index) => (
                  <View
                    key={index}
                    onClick={() => handleTagToggle(tag)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      background: '#F5F5F5',
                      color: '#666',
                      border: '1.5px solid #2D2D2D'
                    }}
                  >
                    {tag}
                  </View>
                ))}
              </View>
            )}

            {/* 自定义标签输入 */}
            {isAddingTag && (
              <View style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px'
              }}>
                <Input
                  style={{
                    flex: 1,
                    fontSize: '14px',
                    padding: '6px 12px',
                    background: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1.5px solid #2D2D2D'
                  }}
                  placeholder='输入自定义标签'
                  value={customTag}
                  onInput={e => setCustomTag(e.detail.value)}
                  focus
                  maxlength={10}
                  onBlur={() => {
                    if (!customTag.trim()) {
                      setIsAddingTag(false)
                    }
                  }}
                />
                <View
                  onClick={handleAddCustomTag}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    background: customTag.trim() ? '#FF4B4B' : '#F5F5F5',
                    color: customTag.trim() ? 'white' : '#666',
                    border: '1.5px solid #2D2D2D'
                  }}
                >
                  添加
                </View>
              </View>
            )}
          </View>

          {/* 位置选择 */}
          <View
            onClick={handleChooseLocation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #2D2D2D'
            }}
          >
            <View style={{ fontSize: '16px' }}>📍</View>
            <View style={{ 
              flex: 1,
              fontSize: '14px',
              color: form.location ? '#2D2D2D' : '#999'
            }}>
              {form.location || '添加位置'}
            </View>
            {form.location && (
              <View
                onClick={(e) => {
                  e.stopPropagation()
                  setForm(prev => ({ ...prev, location: undefined }))
                }}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#F5F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  color: '#666'
                }}
              >
                ×
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '12px',
        paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
        background: '#FFFAF0',
        borderTop: '2px solid #2D2D2D',
        display: 'flex',
        gap: '12px',
        zIndex: 100
      }}>
        <View
          onClick={handleBack}
          style={{
            flex: 1,
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '22px',
            background: '#FFFFFF',
            color: '#2D2D2D',
            fontSize: '16px',
            fontWeight: 'bold',
            border: '2px solid #2D2D2D'
          }}
        >
          取消
        </View>
        <View
          onClick={handlePublish}
          style={{
            flex: 1,
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '22px',
            background: '#FF4B4B',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            border: '2px solid #2D2D2D'
          }}
        >
          发布
        </View>
      </View>
    </View>
  )
} 