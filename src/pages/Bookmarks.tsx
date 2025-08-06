import React from 'react';
import { Bookmark, Clock, X, Hash, Star } from 'lucide-react';

export default function Bookmarks() {
  const bookmarks = [
    {
      id: '1',
      name: 'U-102 사용자 계정 보안 검사',
      description: '사용자 계정의 보안 설정을 종합적으로 검사하는 스크립트',
      category: 'U-102',
      lastUsed: '2024-01-15',
      tags: ['보안', '계정', '인증'],
      icon: '🔐'
    },
    {
      id: '2',
      name: 'U-103 패스워드 정책 검사',
      description: '패스워드 복잡성 및 정책 준수 여부를 검사',
      category: 'U-103',
      lastUsed: '2024-01-14',
      tags: ['패스워드', '정책', '복잡성'],
      icon: '🔑'
    },
    {
      id: '3',
      name: '서버 기본 보안 설정',
      description: '서버의 기본적인 보안 설정을 검사하는 범용 스크립트',
      category: '커스텀',
      lastUsed: '2024-01-12',
      tags: ['서버', '기본설정', '보안'],
      icon: '🖥️'
    },
    {
      id: '4',
      name: 'U-106 세션 관리 검사',
      description: '세션 타임아웃 및 관리 정책을 검사',
      category: 'U-106',
      lastUsed: '2024-01-10',
      tags: ['세션', '타임아웃', '관리'],
      icon: '⏱️'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'U-102': return 'text-green-400';
      case 'U-103': return 'text-primary';
      case 'U-106': return 'text-yellow-400';
      case 'U-107': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryBg = (category: string) => {
    switch (category) {
      case 'U-102': return 'bg-green-400/10';
      case 'U-103': return 'bg-primary/10';
      case 'U-106': return 'bg-yellow-400/10';
      case 'U-107': return 'bg-purple-400/10';
      default: return 'bg-muted/10';
    }
  };

  const handleBookmarkClick = (bookmarkId: string) => {
    console.log('북마크 클릭:', bookmarkId);
  };

  const handleRemoveBookmark = (bookmarkId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    console.log('북마크 제거:', bookmarkId);
  };

  return (
    <div className="min-h-screen bg-background space-y-8">
      {/* Header */}
      <div className="cyber-card p-6 border-b border-border/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Bookmark className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse opacity-30">
              <Bookmark className="h-8 w-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              북마크
            </h1>
            <p className="text-muted-foreground mt-1">
              자주 사용하는 스크립트와 템플릿을 빠르게 찾을 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="cyber-card p-12 text-center">
          <div className="text-6xl mb-6">🔖</div>
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">저장된 북마크가 없습니다</h3>
          <p className="text-muted-foreground">
            스크립트나 템플릿을 북마크하여 빠르게 접근할 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              onClick={() => handleBookmarkClick(bookmark.id)}
              className="stats-card p-6 cursor-pointer group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-2xl">{bookmark.icon}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                      {bookmark.name}
                    </h3>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border mt-1 ${getCategoryColor(bookmark.category)} ${getCategoryBg(bookmark.category)}`}>
                      {bookmark.category}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => handleRemoveBookmark(bookmark.id, e)}
                  className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                {bookmark.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {bookmark.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-card/50 text-muted-foreground rounded-md text-xs border border-border/50"
                  >
                    <Hash className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Last Used */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t border-border/50">
                <Clock className="h-4 w-4" />
                <span>마지막 사용: {bookmark.lastUsed}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions Card */}
      <div className="cyber-card p-6 text-center border border-primary/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-primary">북마크 사용법</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          💡 스크립트 에디터에서 ⭐ 버튼을 클릭하여 북마크에 추가할 수 있습니다.
        </p>
      </div>
    </div>
  );
}