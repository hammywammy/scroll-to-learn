import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Heart Icon - rivet-icons:heart-solid
export const HeartIcon = ({ filled, size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 14.25s-5.5-3.5-5.5-7.5a3.5 3.5 0 0 1 7-0 3.5 3.5 0 0 1 7 0c0 4-5.5 7.5-5.5 7.5z"
      fill={filled ? '#FE2C55' : '#fff'}
    />
  </Svg>
);

// Comment Icon - iconamoon:comment-dots-fill  
export const CommentIcon = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.592.376 3.097 1.043 4.432L2 22l5.568-1.043A9.954 9.954 0 0 0 12 22z"
      fill="#fff"
    />
    <Path
      d="M8.5 12.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm3.5 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
      fill="#000"
    />
  </Svg>
);

// Bookmark Icon - material-symbols:bookmark
export const BookmarkIcon = ({ saved, size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
      fill={saved ? '#FFD700' : '#fff'}
    />
  </Svg>
);

// Share Icon - mingcute:share-forward-fill
export const ShareIcon = ({ size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13.576 17.271c-1.096.46-2.165 1.238-2.913 2.07l-.718.797V3.862l.718.797c.748.832 1.817 1.61 2.913 2.07C15.794 7.713 19.093 8 22 8v8c-2.907 0-6.206.287-8.424 1.271z"
      fill="#fff"
    />
  </Svg>
);
