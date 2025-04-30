import { useState, useEffect } from 'react';
import {
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonInput, IonButton, IonRow, IonCol, IonAvatar, IonPopover, IonIcon,
  IonModal, IonHeader, IonToolbar, IonTitle, IonFooter, IonAlert, IonLabel
} from '@ionic/react';
import { pencil, trash } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  avatar_url: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [popoverState, setPopoverState] = useState<{ open: boolean; event: Event | null; postId: string | null }>({ open: false, event: null, postId: null });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username, user_avatar_url')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUser({ ...authData.user, id: userData.user_id });
          setUsername(userData.username);
        }
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('post_created_at', { ascending: false });
      if (!error) setPosts(data as Post[]);
    };

    fetchUser();
    fetchPosts();
  }, []);

  const createPost = async () => {
    if (!postContent || !user || !username) return;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('user_avatar_url')
      .eq('user_id', user.id)
      .single();

    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return;
    }

    const avatarUrl = userData?.user_avatar_url || 'https://ionicframework.com/docs/img/demos/avatar.svg';

    const { data, error } = await supabase
      .from('posts')
      .insert([{ post_content: postContent, user_id: user.id, username, avatar_url: avatarUrl }])
      .select('*');

    if (!error && data) {
      setPosts([data[0] as Post, ...posts]);
    }

    setPostContent('');
  };

  const deletePost = async (post_id: string) => {
    await supabase.from('posts').delete().match({ post_id });
    setPosts(posts.filter(post => post.post_id !== post_id));
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;
    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');

    if (!error && data) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" style={{ backgroundColor: '#fff9f2' }}>
        {user ? (
          <>
            <IonCard style={{ borderRadius: '15px', backgroundColor: '#fff3e6', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
              <IonCardHeader>
                <IonCardTitle style={{ color: '#c45d00', fontWeight: 'bold' }}>🐶 Share a Dog Moment</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonInput
                  value={postContent}
                  onIonChange={e => setPostContent(e.detail.value!)}
                  placeholder="Write something paw-some..."
                  fill="outline"
                  style={{ borderRadius: '10px', marginBottom: '10px' }}
                />
                <IonButton onClick={createPost} expand="block" shape="round" color="warning">
                  Post
                </IonButton>
              </IonCardContent>
            </IonCard>

            {posts.map(post => (
              <IonCard key={post.post_id} style={{ marginTop: '1.5rem', borderRadius: '15px', backgroundColor: '#fff' }}>
                <IonCardHeader>
                  <IonRow>
                    <IonCol size="2">
                      <IonAvatar>
                        <img alt={post.username} src={post.avatar_url} />
                      </IonAvatar>
                    </IonCol>
                    <IonCol>
                      <IonCardTitle style={{ marginTop: '8px', color: '#444' }}>{post.username}</IonCardTitle>
                      <small style={{ color: '#999' }}>{new Date(post.post_created_at).toLocaleString()}</small>
                    </IonCol>
                    <IonCol size="auto">
                      <IonButton
                        fill="clear"
                        onClick={(e) =>
                          setPopoverState({
                            open: true,
                            event: e.nativeEvent,
                            postId: post.post_id,
                          })
                        }
                      >
                        <IonIcon color="medium" icon={pencil} />
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonCardHeader>

                <IonCardContent>
                  <p style={{ fontSize: '16px', color: '#333' }}>{post.post_content}</p>
                </IonCardContent>

                <IonPopover
                  isOpen={popoverState.open && popoverState.postId === post.post_id}
                  event={popoverState.event}
                  onDidDismiss={() => setPopoverState({ open: false, event: null, postId: null })}
                >
                  <IonButton
                    fill="clear"
                    onClick={() => {
                      startEditingPost(post);
                      setPopoverState({ open: false, event: null, postId: null });
                    }}
                  >
                    Edit
                  </IonButton>
                  <IonButton
                    fill="clear"
                    color="danger"
                    onClick={() => {
                      deletePost(post.post_id);
                      setPopoverState({ open: false, event: null, postId: null });
                    }}
                  >
                    Delete
                  </IonButton>
                </IonPopover>
              </IonCard>
            ))}
          </>
        ) : (
          <IonLabel>Loading your pawsome feed...</IonLabel>
        )}
      </IonContent>

      <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
        <IonHeader>
          <IonToolbar color="warning">
            <IonTitle>Edit Post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonInput
            value={postContent}
            onIonChange={e => setPostContent(e.detail.value!)}
            placeholder="Edit your post..."
            fill="outline"
            style={{ borderRadius: '10px' }}
          />
        </IonContent>
        <IonFooter className="ion-padding">
          <IonButton expand="block" onClick={savePost} color="success">Save</IonButton>
          <IonButton expand="block" onClick={() => setIsModalOpen(false)} fill="clear" color="medium">Cancel</IonButton>
        </IonFooter>
      </IonModal>

      <IonAlert
        isOpen={isAlertOpen}
        onDidDismiss={() => setIsAlertOpen(false)}
        header="Success"
        message="Post updated successfully!"
        buttons={['OK']}
      />
    </IonPage>
  );
};

export default FeedContainer;
