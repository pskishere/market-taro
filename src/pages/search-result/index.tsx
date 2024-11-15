import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setKeyword, setResults, setLoading } from '../../store/search/actions'
import './index.scss'

export default function SearchResultPage() {
  const dispatch = useDispatch()
  const { keyword, results, loading } = useSelector((state: RootState) => state.search)

  // 模拟搜索结果数据
  const mockResults = [
    {
      id: '1',
      title: '东京迪士尼乐园',
      subTitle: '东京都江户川区舞浜',
      type: 'activity',
      image: 'https://example.com/disney.jpg',
      tags: ['主题乐园', '亲子游', '热门']
    },
    {
      id: '2',
      title: '浅草寺',
      subTitle: '东京都台东区浅草',
      type: 'location',
      image: 'https://example.com/temple.jpg',
      tags: ['文化古迹', '打卡地']
    },
    {
      id: '3',
      title: '寿司大',
      subTitle: '东京都中央区筑地',
      type: 'food',
      image: 'https://example.com/sushi.jpg',
      tags: ['日料', '米其林']
    }
  ]

  useLoad((options) => {
    if (options.keyword) {
      dispatch(setKeyword(decodeURIComponent(options.keyword)))
      dispatch(setLoading(true))
      // 模拟搜索请求
      setTimeout(() => {
        dispatch(setResults(mockResults))
        dispatch(setLoading(false))
      }, 1000)
    }
  })

  return (
    <View className='search-result-page'>
      {/* 搜索头部 */}
      <View style={{
        padding: '16px',
        background: '#FFFAF0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Text style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {`"${keyword}" 的搜索结果`}
        </Text>
        <Text style={{
          fontSize: '14px',
          color: '#666',
          marginLeft: '8px'
        }}>
          {`共 ${results.length} 个`}
        </Text>
      </View>

      {/* 搜索结果列表 */}
      <View style={{ padding: '12px' }}>
        {loading ? (
          <View style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#999'
          }}>
            加载中...
          </View>
        ) : results.length > 0 ? (
          results.map(result => (
            <View
              key={result.id}
              className='result-item'
              style={{
                background: '#FFF',
                borderRadius: '12px',
                marginBottom: '12px',
                overflow: 'hidden'
              }}
            >
              {/* 结果图片 */}
              <View style={{
                height: '160px',
                background: '#f5f5f5',
                backgroundImage: `url(${result.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              
              {/* 结果信息 */}
              <View style={{ padding: '12px' }}>
                <View style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '4px'
                }}>
                  {result.title}
                </View>
                <View style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '8px'
                }}>
                  {result.subTitle}
                </View>
                
                {/* 标签列表 */}
                <View style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  {result.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={{
                        fontSize: '12px',
                        color: '#666',
                        background: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {tag}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#999'
          }}>
            未找到相关结果
          </View>
        )}
      </View>
    </View>
  )
} 