import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  X, 
  Zap, 
  ZapOff, 
  Image as ImageIcon,
  Camera as CameraIcon 
} from 'lucide-react-native';
import { BrandColors } from '@/constants/Typography';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface QRScannerProps {
  visible: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ visible, onClose, onScanSuccess }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanned, setScanned] = useState(false);

  // Animation values
  const scanLinePosition = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);

  // Animated scanning line
  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 300 });
      scanLinePosition.value = withRepeat(
        withSequence(
          withTiming(200, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      scanLinePosition.value = 0;
    }
  }, [visible]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const animatedScanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLinePosition.value }],
  }));

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setScanned(true);
      onScanSuccess(data);
      // Reset after a delay
      setTimeout(() => setScanned(false), 1000);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // Here you would process the image for QR codes
        Alert.alert('Gallery', 'Image selected! QR processing would happen here.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Animated.View style={[styles.container, animatedOverlayStyle]}>
        <LinearGradient
          colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
          style={styles.permissionContainer}>
          <CameraIcon size={48} color="white" />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan QR codes
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  }

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedOverlayStyle]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <CameraView
        style={styles.camera}
        facing="back"
        flash={flashEnabled ? 'on' : 'off'}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}>
        
        {/* Scanner Overlay */}
        <View style={styles.overlay}>
          {/* Top Controls */}
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={onClose}>
              <X size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              {flashEnabled ? (
                <Zap size={24} color="#FFD700" />
              ) : (
                <ZapOff size={24} color="white" />
              )}
            </TouchableOpacity>
          </View>

          {/* Scanner Frame */}
          <View style={styles.scannerFrame}>
            <View style={styles.scannerBorder}>
              {/* Corner Brackets */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Animated Scan Line */}
              <Animated.View style={[styles.scanLine, animatedScanLineStyle]} />
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {scanned ? 'QR Code Detected!' : 'Align QR code within the frame'}
            </Text>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={pickImageFromGallery}>
              <View style={styles.galleryButtonInner}>
                <ImageIcon size={20} color="white" />
              </View>
              <Text style={styles.galleryButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBorder: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: BrandColors.primaryGreen,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: BrandColors.primaryGreen,
    shadowColor: BrandColors.primaryGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  instructionContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Outfit-Medium',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  galleryButton: {
    alignItems: 'center',
  },
  galleryButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Outfit-Medium',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Outfit-SemiBold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  permissionButtonText: {
    color: BrandColors.primaryGreen,
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRScanner;