import { View, Image, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'

interface PostDetail {
  id: string
  title: string
  author: {
    name: string
    avatar: string
  }
  createTime: string
  content: string
  images: string[]
  location: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
  tags: string[]
  likes: number
  comments: number
}

export default function PostDetail() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<PostDetail | null>(null)

  // 获取系统信息
  const [systemInfo] = useState(() => Taro.getSystemInfoSync())
  const safeAreaTop = systemInfo?.safeArea?.top || 0
  const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
  const navigationBarHeight = (menuButtonInfo.top - safeAreaTop) * 2 + menuButtonInfo.height

  // 模拟获取帖子详情数据
  useEffect(() => {
    const mockPost: PostDetail = {
      id: router.params.id || '1',
      title: '探店｜超好喝的咖啡店',
      author: {
        name: '咖啡达人',
        avatar: 'https://example.com/avatar.jpg'
      },
      createTime: '2024-03-20 14:30',
      content: '今天发现了一家超级棒的咖啡店！店内环境很安静，非常适合工作和学习。他们家的手冲咖啡特别香醇，使用的是来自埃塞俄比亚的咖啡豆。最推荐他们家的拿铁，奶泡绵密，咖啡的苦香和牛奶的香甜完美融合...',
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
      tags: ['咖啡', '探店', '美食'],
      likes: 128,
      comments: 32
    }

    setPost(mockPost)
    setLoading(false)
  }, [router.params.id])

  // 处理导航到地图
  const handleNavigateToMap = () => {
    if (post) {
      Taro.openLocation({
        latitude: post.location.latitude,
        longitude: post.location.longitude,
        name: post.location.name,
        address: post.location.address
      })
    }
  }

  if (loading) {
    return (
      <View style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFAF0',
        paddingTop: `${safeAreaTop}px`
      }}>
        <View style={{
          color: '#2D2D2D',
          fontSize: '16px',
          fontWeight: 'bold'
        }}>
          加载中...
        </View>
      </View>
    )
  }

  if (!post) return null

  return (
    <ScrollView
      scrollY
      style={{
        height: '100vh',
        background: '#FFFAF0'
      }}
    >
      {/* 顶部安全区域 */}
      <View style={{
        height: `${safeAreaTop}px`,
        background: '#FFFAF0'
      }} />

      {/* 顶部作者信息 */}
      <View style={{
        padding: '16px',
        paddingTop: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid #EAEAEA',
        background: '#FFFAF0'
      }}>
        <Image
          src={post.author.avatar}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '24px',
            border: '2px solid #2D2D2D'
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2D2D2D',
            marginBottom: '4px'
          }}>
            {post.author.name}
          </View>
          <View style={{
            fontSize: '12px',
            color: '#666666'
          }}>
            {post.createTime}
          </View>
        </View>
      </View>

      {/* 帖子内容 */}
      <View style={{ 
        padding: '16px',
        paddingBottom: `${safeAreaTop}px`
      }}>
        <View style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#2D2D2D',
          marginBottom: '12px'
        }}>
          {post.title}
        </View>

        {/* 标签 */}
        <View style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          {post.tags.map((tag, index) => (
            <View
              key={index}
              style={{
                fontSize: '12px',
                color: '#2D2D2D',
                background: '#FFE4CC',
                padding: '4px 12px',
                borderRadius: '12px',
                border: '1.5px solid #2D2D2D'
              }}
            >
              {tag}
            </View>
          ))}
        </View>

        {/* 正文 */}
        <View style={{
          fontSize: '14px',
          color: '#333333',
          lineHeight: 1.6,
          marginBottom: '16px'
        }}>
          {post.content}
        </View>

        {/* 图片网格 */}
        <View style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          marginBottom: '16px'
        }}>
          {post.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              mode='aspectFill'
              style={{
                width: '100%',
                height: '100px',
                borderRadius: '8px',
                border: '2px solid #2D2D2D'
              }}
            />
          ))}
        </View>

        {/* 位置信息 */}
        <View
          onClick={handleNavigateToMap}
          style={{
            background: '#FFFFFF',
            padding: '12px',
            borderRadius: '12px',
            border: '2px solid #2D2D2D',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}
        >
          <View style={{
            fontSize: '20px'
          }}>
            📍
          </View>
          <View style={{ flex: 1 }}>
            <View style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#2D2D2D',
              marginBottom: '4px'
            }}>
              {post.location.name}
            </View>
            <View style={{
              fontSize: '12px',
              color: '#666666'
            }}>
              {post.location.address}
            </View>
          </View>
        </View>

        {/* 互动数据 */}
        <View style={{
          display: 'flex',
          gap: '16px',
          color: '#666666',
          fontSize: '14px'
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
    </ScrollView>
  )
}

// 添加页面配置
definePageConfig({
  navigationBarTitleText: '帖子详情',
  navigationBarBackgroundColor: '#FFFAF0',
  navigationBarTextStyle: 'black',
  backgroundColor: '#FFFAF0'
}) 