import { useEffect, useState } from 'react';
import { SQuery } from '../../managementState';

type statPost = {
  likes: number;
  comments: number;
  shares: number;
  totalCommentsCount: number;
  isLiked: boolean;
};
export const useStatPost = ({ data, postId }: { data: statPost; postId: string }) => {
  //   console.log('🚀 ~ useStatPost ~ data:', data);
  const [statPos, setStatPos] = useState<statPost>(data);

  const toogleLike = (statPos: statPost) => {
    setStatPos(() => {
      return {
        ...statPos,
        likes: statPos['isLiked'] ? statPos['likes'] - 1 : statPos['likes'] + 1,
        isLiked: !statPos['isLiked'],
      };
    });
  };

  const sendLike = async () => {
    try {
      let dataStatPost = await SQuery.service('post', 'statPost', {
        postId,
        like: !statPos['isLiked'],
      });

      setStatPos(() => {
        return {
          comments: dataStatPost.response?.comments || 0,
          likes: dataStatPost.response?.likes || 0,
          isLiked: dataStatPost.response?.isLiked || false,
          shares: dataStatPost.response?.shares || 0,
          totalCommentsCount: dataStatPost.response?.totalCommentsCount || 0,
        };
      });
    } catch (error) {
      console.error(error, 'like');
    }
  };
  useEffect(() => {
    const refreshState = async () => {
      let dataStatPost = await SQuery.service('post', 'statPost', {
        postId,
      });
      setStatPos(() => {
        return {
          comments: dataStatPost.response?.comments || 0,
          likes: dataStatPost.response?.likes || 0,
          isLiked: dataStatPost.response?.isLiked || false,
          shares: dataStatPost.response?.shares || 0,
          totalCommentsCount: dataStatPost.response?.totalCommentsCount || 0,
        };
      });
    };
    refreshState();
  }, []);

  return { toogleLike, statPos, sendLike };
};
