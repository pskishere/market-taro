import { View, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import React from 'react'

interface Post {
  id: string
  title: string
  content: string
  images: string[]
  location: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
  createTime: string
  likes: number
  comments: number
  tags: string[]
  timeSlots: string[]
}

export default function MyPosts() {
  const [systemInfo] = useState(() => Taro.getSystemInfoSync())
  const safeAreaTop = systemInfo?.safeArea?.top || 0

  // 模拟帖子数据
  const [posts] = useState<Post[]>([
    {
      id: '1',
      title: '探店｜超好喝的咖啡店',
      content: '今天发现了一家超级棒的咖啡店！店内环境很安静，非常适合工作和学习...',
      images: [
        'https://example.com/coffee1.jpg',
        'https://example.com/coffee2.jpg',
        'https://example.com/coffee3.jpg'
      ],
      location: {
        name: '星巴克咖啡',
        address: '北京市朝阳区三里屯太古里北区N1-12号',
        latitude: 39.909775,
        longitude: 116.407315
      },
      createTime: '2024-03-20 14:30',
      likes: 128,
      comments: 32,
      tags: ['咖啡', '探店', '安静'],
      timeSlots: ['10:00-22:00']
    },
    {
      id: '2',
      title: '这家火锅太赞了！',
      content: '人均100，味道非常不错，服务态度也很好，推荐大家来尝试...',
      images: [
        'https://example.com/hotpot1.jpg',
        'https://example.com/hotpot2.jpg'
      ],
      location: {
        name: '海底捞火锅',
        address: '北京市朝阳区三里屯路19号',
        latitude: 39.908775,
        longitude: 116.406315
      },
      createTime: '2024-03-19 19:30',
      likes: 256,
      comments: 48,
      tags: ['火锅', '美食', '聚会'],
      timeSlots: ['11:00-02:00']
    }
  ])

  // 处理帖子点击
  const handlePostClick = (postId: string) => {
    Taro.navigateTo({
      url: `../post-detail/index?id=${postId}`
    })
  }

  // 处理长按帖子
  const handleLongPress = (postId: string) => {
    Taro.showActionSheet({
      itemList: ['编辑', '删除'],
      itemColor: '#FF4B4B'
    }).then(res => {
      if (res.tapIndex === 0) {
        // 编辑帖子
        Taro.navigateTo({
          url: `../post/index?id=${postId}`
        })
      } else if (res.tapIndex === 1) {
        // 删���帖子
        Taro.showModal({
          title: '确认删除',
          content: '确定要删除这条帖子吗？',
          confirmColor: '#FF4B4B'
        }).then(modal => {
          if (modal.confirm) {
            // TODO: 实现删除逻辑
            Taro.showToast({
              title: '删除成功',
              icon: 'success'
            })
          }
        })
      }
    })
  }

  // 处理打开地图
  const handleOpenLocation = (location: Post['location'], e: any) => {
    e.stopPropagation()
    Taro.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      address: location.address
    })
  }

  return (
    <View style={{
      background: '#FFFAF0',
      paddingTop: `${safeAreaTop / 2}px`
    }}>
      <ScrollView
        scrollY
        style={{
          height: 'calc(100vh - 44px)'
        }}
      >
        {posts.map(post => (
          <View
            key={post.id}
            onClick={() => handlePostClick(post.id)}
            onLongPress={() => handleLongPress(post.id)}
            style={{
              margin: '8px 16px',
              padding: '16px',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '2px solid #2D2D2D'
            }}
          >
            {/* 标题 */}
            <View style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2D2D2D',
              marginBottom: '8px'
            }}>
              {post.title}
            </View>

            {/* 标签 */}
            <View style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
              flexWrap: 'wrap'
            }}>
              {post.tags.map((tag, index) => (
                <View
                  key={index}
                  style={{
                    fontSize: '12px',
                    color: '#2D2D2D',
                    background: '#FFE4CC',
                    padding: '4px 8px',
                    borderRadius: '8px'
                  }}
                >
                  {tag}
                </View>
              ))}
            </View>

            {/* 内容预览 */}
            <View style={{
              fontSize: '14px',
              color: '#666666',
              marginBottom: '12px',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden'
            }}>
              {post.content}
            </View>

            {/* 图片网格 */}
            {post.images.length > 0 && (
              <View style={{
                display: 'grid',
                gridTemplateColumns: post.images.length === 1 ? '1fr' : 
                  post.images.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {post.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    mode='aspectFill'
                    style={{
                      width: '100%',
                      height: post.images.length === 1 ? '200px' : '100px',
                      borderRadius: '8px',
                      border: '2px solid #2D2D2D'
                    }}
                  />
                ))}
              </View>
            )}

            {/* 位置信息 */}
            <View
              onClick={(e) => handleOpenLocation(post.location, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}
            >
              <View style={{ fontSize: '16px' }}>📍</View>
              <View style={{
                fontSize: '14px',
                color: '#666666'
              }}>
                {post.location.name}
              </View>
            </View>

            {/* 底部信息 */}
            <View style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <View style={{
                fontSize: '12px',
                color: '#999999'
              }}>
                {post.createTime}
              </View>
              <View style={{
                display: 'flex',
                gap: '16px',
                fontSize: '14px',
                color: '#666666'
              }}>
                <View style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ❤️ {post.likes}
                </View>
                <View style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  💬 {post.comments}
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

// 添加页面配置
definePageConfig({
  navigationBarTitleText: '我的发布',
  navigationBarBackgroundColor: '#FFFAF0',
  navigationBarTextStyle: 'black',
  backgroundColor: '#FFFAF0'
}) 