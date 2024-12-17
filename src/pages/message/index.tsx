import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import React from 'react'

interface Message {
  id: string
  type: 'system' | 'like' | 'comment'
  title: string
  content: string
  time: string
  read: boolean
  sender?: {
    name: string
    avatar: string
  }
  postId?: string
}

export default function Message() {
  const [systemInfo] = useState(() => Taro.getSystemInfoSync())
  const safeAreaTop = systemInfo?.safeArea?.top || 0

  // 消息数据
  const [messages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      title: '系统通知',
      content: '欢迎使用小程序，这里是系统通知内容。',
      time: '刚刚',
      read: false
    },
    {
      id: '2',
      type: 'like',
      title: '收到点赞',
      content: '点赞了你的帖子《探店｜超好喝的咖啡店》',
      time: '10分钟前',
      read: true,
      sender: {
        name: '咖啡达人',
        avatar: 'https://example.com/avatar1.jpg'
      },
      postId: '123'
    },
    {
      id: '3',
      type: 'comment',
      title: '收到评论',
      content: '这家店我也去过，确实不错！推荐他们家的拿铁~',
      time: '1小时前',
      read: false,
      sender: {
        name: '美食家',
        avatar: 'https://example.com/avatar2.jpg'
      },
      postId: '123'
    }
  ])

  // 处理消息点击
  const handleMessageClick = (message: Message) => {
    if (message.postId) {
      Taro.navigateTo({
        url: `../post-detail/index?id=${message.postId}`
      })
    }
  }

  // 渲染消息图标
  const renderMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'system':
        return '📢'
      case 'like':
        return '❤️'
      case 'comment':
        return '💬'
      default:
        return '📝'
    }
  }

  return (
    <View style={{
      background: '#FFFAF0',
      paddingTop: `${safeAreaTop / 2}px`
    }}>
      {messages.map(message => (
        <View
          key={message.id}
          onClick={() => handleMessageClick(message)}
          style={{
            margin: '8px 16px',
            padding: '16px',
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '2px solid #2D2D2D',
            position: 'relative'
          }}
        >
          {/* 未读标记 */}
          {!message.read && (
            <View style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '8px',
              height: '8px',
              background: '#FF4B4B',
              borderRadius: '50%'
            }} />
          )}

          <View style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            {/* 消息图标或用户头像 */}
            {message.sender ? (
              <Image
                src={message.sender.avatar}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '20px',
                  border: '2px solid #2D2D2D'
                }}
              />
            ) : (
              <View style={{
                width: '40px',
                height: '40px',
                borderRadius: '20px',
                background: '#FFE4CC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                {renderMessageIcon(message.type)}
              </View>
            )}

            {/* 消息内容 */}
            <View style={{ flex: 1 }}>
              {/* 发送者名称 */}
              {message.sender && (
                <View style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#2D2D2D',
                  marginBottom: '4px'
                }}>
                  {message.sender.name}
                </View>
              )}

              {/* 消息标题 */}
              <View style={{
                fontSize: message.sender ? '12px' : '14px',
                fontWeight: message.sender ? 'normal' : 'bold',
                color: '#2D2D2D',
                marginBottom: '4px'
              }}>
                {message.title}
              </View>

              {/* 消息内容 */}
              <View style={{
                fontSize: '14px',
                color: '#666666',
                marginBottom: '8px'
              }}>
                {message.content}
              </View>

              {/* 时间 */}
              <View style={{
                fontSize: '12px',
                color: '#999999'
              }}>
                {message.time}
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

// 添加页面配置
definePageConfig({
  navigationBarTitleText: '消息',
  navigationBarBackgroundColor: '#FFFAF0',
  navigationBarTextStyle: 'black',
  backgroundColor: '#FFFAF0'
}) 