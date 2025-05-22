import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image as RNImage
} from 'react-native';
import { X, Image as ImageIcon, Check } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useLibraryStore } from '@/stores/libraryStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

// Sample cover images
const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop',
];

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreatePlaylistModal({ visible, onClose }: CreatePlaylistModalProps) {
  const { createPlaylist } = useLibraryStore();
  const { theme: appTheme } = useSettingsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCoverUrl, setSelectedCoverUrl] = useState(COVER_IMAGES[0]);
  
  const handleCreate = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a playlist title');
      return;
    }
    
    createPlaylist({
      title: title.trim(),
      description: description.trim() || 'My playlist',
      coverUrl: selectedCoverUrl,
      songs: [],
    });
    
    // Reset form and close modal
    setTitle('');
    setDescription('');
    setSelectedCoverUrl(COVER_IMAGES[0]);
    onClose();
  };
  
  const handleCancel = () => {
    // Reset form and close modal
    setTitle('');
    setDescription('');
    setSelectedCoverUrl(COVER_IMAGES[0]);
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.content, { backgroundColor: themeColors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              Create Playlist
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={handleCancel}
            >
              <X size={24} color={themeColors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.form}>
            <Text style={[styles.label, { color: themeColors.text }]}>
              Playlist Title
            </Text>
            <TextInput
              style={[
                styles.input, 
                { 
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border
                }
              ]}
              value={title}
              onChangeText={setTitle}
              placeholder="My Awesome Playlist"
              placeholderTextColor={themeColors.subtext}
              autoFocus
            />
            
            <Text style={[styles.label, { color: themeColors.text }]}>
              Description (optional)
            </Text>
            <TextInput
              style={[
                styles.input, 
                styles.textArea,
                { 
                  color: themeColors.text,
                  backgroundColor: themeColors.background,
                  borderColor: themeColors.border
                }
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your playlist..."
              placeholderTextColor={themeColors.subtext}
              multiline
              numberOfLines={3}
            />
            
            <Text style={[styles.label, { color: themeColors.text }]}>
              Cover Image
            </Text>
            <View style={styles.coverOptions}>
              {COVER_IMAGES.map((url) => (
                <TouchableOpacity
                  key={url}
                  style={[
                    styles.coverOption,
                    selectedCoverUrl === url && styles.selectedCover,
                    selectedCoverUrl === url && { borderColor: themeColors.primary }
                  ]}
                  onPress={() => setSelectedCoverUrl(url)}
                >
                  {url ? (
                    <View style={styles.coverImageContainer}>
                      <Image
                        source={{ uri: url }}
                        style={styles.coverImage}
                        contentFit="cover"
                      />
                      {selectedCoverUrl === url && (
                        <View style={[styles.selectedIndicator, { backgroundColor: themeColors.primary }]}>
                          <Check size={16} color="#000" />
                        </View>
                      )}
                    </View>
                  ) : (
                    <ImageIcon size={24} color={themeColors.text} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.cancelButton, { borderColor: themeColors.border }]}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelButtonText, { color: themeColors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: themeColors.primary }]}
              onPress={handleCreate}
            >
              <Text style={styles.createButtonText}>
                Create
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.2)',
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: theme.typography.fontSizes.md,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  coverOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  coverOption: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 12,
    marginBottom: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(150,150,150,0.2)',
  },
  selectedCover: {
    borderWidth: 2,
  },
  coverImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  createButtonText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '600',
    color: '#000',
  },
});