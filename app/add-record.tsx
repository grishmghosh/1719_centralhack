import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import {
  Camera,
  Image as ImageIcon,
  FileText,
  Calendar,
  Tag,
  Save,
  X,
  ChevronDown,
  Sparkles,
  CheckCircle,
  Hospital,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';
import BackArrow from '@/components/BackArrow';
import { useOCR, MedicalDataExtracted } from '@/hooks/useOCR';
import { supabase } from '@/lib/supabase';

// Consistent Spacing and Sizing
const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

const IconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const STROKE_WIDTH = 1.5;

// Document Categories
const DOCUMENT_CATEGORIES = [
  { id: 'lab-results', label: 'Lab Results', icon: FileText },
  { id: 'pathology-report', label: 'Pathology Report', icon: FileText },
  { id: 'prescription', label: 'Prescription', icon: FileText },
  { id: 'doctor-notes', label: 'Doctor Notes', icon: FileText },
  { id: 'imaging', label: 'X-Ray/MRI/Scan', icon: FileText },
  { id: 'insurance', label: 'Insurance Document', icon: FileText },
  { id: 'vaccination', label: 'Vaccination Record', icon: FileText },
  { id: 'other', label: 'Other', icon: FileText },
];

export default function AddRecordScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [documentDate, setDocumentDate] = useState('');
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [extractedData, setExtractedData] = useState<MedicalDataExtracted | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showManualTextEntry, setShowManualTextEntry] = useState(false);
  const [manualText, setManualText] = useState('');

  // OCR functionality
  const { processImage, extractMedicalData, isProcessing, error, clearError } = useOCR();

  const handleCameraPress = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to take photos of your health documents.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable cropping for full document capture
        quality: 0.9, // Higher quality for better OCR accuracy
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        await processImageWithOCR(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  const handleGalleryPress = async () => {
    try {
      // Request gallery permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Gallery Permission Required',
          'Please grant gallery permission to select photos of your health documents.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Launch gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Disable cropping for full document capture
        quality: 0.9, // Higher quality for better OCR accuracy
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        await processImageWithOCR(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  const processImageWithOCR = async (imageUri: string) => {
    try {
      clearError();
      const ocrResult = await processImage(imageUri);
      
      if (ocrResult && ocrResult.text) {
        const medicalData = extractMedicalData(ocrResult.text);
        setExtractedData(medicalData);
        
        // Auto-populate form fields
        if (medicalData.title && !documentTitle) {
          setDocumentTitle(medicalData.title);
        }
        if (medicalData.date && !documentDate) {
          setDocumentDate(medicalData.date);
        }
        if (medicalData.provider && !provider) {
          setProvider(medicalData.provider);
        }
        if (medicalData.category && !selectedCategory) {
          // Map OCR-detected categories to form categories
          const categoryMappings: { [key: string]: string } = {
            'Pathology Report': 'pathology-report',
            'Lab Results': 'lab-results',
            'Imaging Report': 'imaging',
            'Prescription': 'prescription',
            'Doctor Notes': 'doctor-notes',
            'Vaccination Record': 'vaccination',
          };
          
          const formCategoryId = categoryMappings[medicalData.category];
          if (formCategoryId) {
            setSelectedCategory(formCategoryId);
          } else {
            // Fallback: try to find by label match
            const matchingCategory = DOCUMENT_CATEGORIES.find(
              cat => cat.label === medicalData.category
            );
            if (matchingCategory) {
              setSelectedCategory(matchingCategory.id);
            }
          }
        }
        
        // Generate clean, structured notes from extracted data
        let autoNotes = '';
        
        // Since provider now has its own field, don't include it in notes
        // Also don't include date information since it has its own field
        
        // Add critical findings first (most important)
        if (medicalData.findings && medicalData.findings.length > 0) {
          autoNotes += '🔍 Key Findings:\n';
          medicalData.findings.forEach(finding => {
            // Filter out date-related findings from notes
            const lowerFinding = finding.toLowerCase();
            const isDateRelated = lowerFinding.includes('generated on') || 
                                 lowerFinding.includes('report date') ||
                                 lowerFinding.includes('collected on') ||
                                 lowerFinding.includes('registered on') ||
                                 /\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}/.test(lowerFinding) ||
                                 /\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(lowerFinding);
            
            if (!isDateRelated) {
              // Highlight critical results
              const isUrgent = lowerFinding.includes('detected') || 
                             lowerFinding.includes('positive') ||
                             lowerFinding.includes('high risk') ||
                             lowerFinding.includes('abnormal');
              const prefix = isUrgent ? '🚨 ' : '• ';
              autoNotes += `${prefix}${finding}\n`;
            }
          });
          autoNotes += '\n';
        }
        
        // Add lab values (if any) in a clean format
        if (medicalData.values && medicalData.values.length > 0) {
          autoNotes += '📊 Lab Values:\n';
          medicalData.values.forEach(value => {
            autoNotes += `• ${value.name}: ${value.value}`;
            if (value.unit) autoNotes += ` ${value.unit}`;
            if (value.normalRange) autoNotes += ` (Normal: ${value.normalRange})`;
            autoNotes += '\n';
          });
          autoNotes += '\n';
        }
        
        // Add medications (if any)
        if (medicalData.medications && medicalData.medications.length > 0) {
          autoNotes += '💊 Medications:\n';
          medicalData.medications.forEach(med => {
            autoNotes += `• ${med.name}`;
            if (med.dosage) autoNotes += ` - ${med.dosage}`;
            if (med.frequency) autoNotes += ` (${med.frequency})`;
            autoNotes += '\n';
          });
          autoNotes += '\n';
        }
        
        // Add note about OCR processing
        autoNotes += '📝 Note: This information was automatically extracted from your document. Please review for accuracy.';
        
        if (autoNotes && !notes) {
          setNotes(autoNotes.trim());
        }
        
        Alert.alert(
          'OCR Complete!',
          `Document successfully analyzed! Confidence: ${Math.round(ocrResult.confidence * 100)}%. Form fields have been auto-populated - please review and edit as needed.`,
          [{ text: 'OK' }]
        );
      } else {
        // If OCR failed, offer manual text entry as fallback
        Alert.alert(
          'OCR Not Available',
          'Automatic text recognition failed. Would you like to manually enter the document text?',
          [
            { text: 'Skip', style: 'cancel' },
            { 
              text: 'Enter Manually', 
              onPress: () => setShowManualTextEntry(true) 
            }
          ]
        );
      }
    } catch (error) {
      console.error('OCR processing error:', error);
      
      // Check if it's a 403 API error (quota exceeded)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const is403Error = errorMessage.includes('403') || errorMessage.includes('access denied');
      
      Alert.alert(
        'OCR Error', 
        is403Error 
          ? 'OCR API quota exceeded or access denied. Would you like to manually enter the text instead?'
          : 'Failed to process document automatically. Would you like to manually enter the text?',
        [
          { text: 'Skip', style: 'cancel' },
          { 
            text: 'Enter Manually', 
            onPress: () => setShowManualTextEntry(true) 
          }
        ]
      );
    }
  };

  const handleManualTextEntry = () => {
    if (manualText.trim()) {
      const medicalData = extractMedicalData(manualText);
      setExtractedData(medicalData);
      
      // Auto-populate form fields from manual text
      if (medicalData.title && !documentTitle) {
        setDocumentTitle(medicalData.title);
      }
      if (medicalData.date && !documentDate) {
        setDocumentDate(medicalData.date);
      }
      if (medicalData.category && !selectedCategory) {
        // Map OCR-detected categories to form categories
        const categoryMappings: { [key: string]: string } = {
          'Pathology Report': 'pathology-report',
          'Lab Results': 'lab-results',
          'Imaging Report': 'imaging',
          'Prescription': 'prescription',
          'Doctor Notes': 'doctor-notes',
          'Vaccination Record': 'vaccination',
        };
        
        const formCategoryId = categoryMappings[medicalData.category];
        if (formCategoryId) {
          setSelectedCategory(formCategoryId);
        } else {
          // Fallback: try to find by label match
          const matchingCategory = DOCUMENT_CATEGORIES.find(
            cat => cat.label === medicalData.category
          );
          if (matchingCategory) {
            setSelectedCategory(matchingCategory.id);
          }
        }
      }
      
      // Update notes
      if (!notes) {
        setNotes(manualText);
      }
      
      setShowManualTextEntry(false);
      setManualText('');
      
      Alert.alert(
        'Text Processed!',
        'Document text has been analyzed and form fields have been auto-populated.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleDateChange = (text: string) => {
    // Remove all non-numeric characters
    const numbers = text.replace(/\D/g, '');
    
    // Auto-format based on length
    let formatted = numbers;
    if (numbers.length >= 3 && numbers.length <= 4) {
      // DD/MM format
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2);
    } else if (numbers.length >= 5) {
      // DD/MM/YYYY format
      formatted = numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4, 8);
    }
    
    // Limit to reasonable date length (DD/MM/YYYY)
    if (formatted.length <= 10) {
      setDocumentDate(formatted);
    }
  };

  const handleSave = async () => {
    if (!selectedImage || !documentTitle || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields and select a document image.');
      return;
    }

    try {
      setIsSaving(true);

      // Prepare record data for database
      const recordData = {
        title: documentTitle,
        date: documentDate || new Date().toISOString().split('T')[0],
        type: getSelectedCategoryLabel(),
        icon_name: 'FileText',
        color_key: 'primaryGreen',
        has_ai_summary: !!extractedData,
        urgency: 'normal',
        provider: provider || extractedData?.provider || 'Unknown Provider',
        content_type: 'document',
        record_data: {
          imageUri: selectedImage,
          extractedData: extractedData,
          userNotes: notes,
        },
        ai_summary: extractedData ? generateAISummary(extractedData) : null,
        ai_confidence: extractedData ? 0.9 : null,
        medical_content: notes || 'No additional notes provided',
        user_id: 'current_user', // TODO: Replace with actual user ID
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to Supabase
      const { data, error } = await supabase
        .from('medical_records')
        .insert([recordData])
        .select();

      if (error) {
        throw error;
      }

      Alert.alert(
        'Success!', 
        `Document saved successfully!${extractedData ? ' OCR data has been processed and stored.' : ''}`,
        [{ 
          text: 'OK', 
          onPress: () => router.back() 
        }]
      );
      
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save document. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const generateAISummary = (data: MedicalDataExtracted): string => {
    let summary = '';
    
    if (data.category) {
      summary += `${data.category} processed. `;
    }
    
    if (data.values && data.values.length > 0) {
      summary += `${data.values.length} lab value(s) recorded. `;
      const abnormalValues = data.values.filter(v => 
        v.value && v.normalRange && !isValueInRange(v.value, v.normalRange)
      );
      if (abnormalValues.length > 0) {
        summary += `${abnormalValues.length} value(s) outside normal range require attention. `;
      }
    }
    
    if (data.medications && data.medications.length > 0) {
      summary += `${data.medications.length} medication(s) documented. `;
    }
    
    if (data.findings && data.findings.length > 0) {
      summary += `Key findings noted. `;
    }
    
    return summary || 'Document processed and stored for your records.';
  };

  const isValueInRange = (value: string, normalRange: string): boolean => {
    // Simple range check - in production, this would be more sophisticated
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return true; // Non-numeric values are considered normal
    
    const rangeMatch = normalRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      return numValue >= min && numValue <= max;
    }
    
    return true;
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowCategoryPicker(false);
  };

  const getSelectedCategoryLabel = () => {
    const category = DOCUMENT_CATEGORIES.find(cat => cat.id === selectedCategory);
    return category ? category.label : 'Select Category';
  };

  return (
    <LinearGradient
      colors={[BrandColors.cream, '#F8F4EB', '#F6F2E9', BrandColors.cream]}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}>
      
      {/* Header */}
      <Animated.View
        entering={FadeInDown.delay(50).springify()}
        style={styles.header}>
        <BackArrow onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Add Health Record</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Document Capture Section */}
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Capture Document</Text>
          
          {selectedImage ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  setSelectedImage(null);
                  setExtractedData(null);
                  clearError();
                }}>
                <X size={IconSizes.medium} color={BrandColors.error} strokeWidth={STROKE_WIDTH} />
              </TouchableOpacity>
              
              {/* OCR Processing Status */}
              {isProcessing && (
                <View style={styles.processingOverlay}>
                  <View style={styles.processingCard}>
                    <ActivityIndicator size="large" color={BrandColors.primaryGreen} />
                    <Text style={styles.processingText}>Analyzing document...</Text>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => {
                        clearError();
                        setShowManualTextEntry(true);
                      }}>
                      <Text style={styles.cancelButtonText}>Enter Manually Instead</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              
              {/* OCR Success Indicator */}
              {extractedData && !isProcessing && (
                <View style={styles.ocrSuccessIndicator}>
                  <LinearGradient
                    colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
                    style={styles.ocrSuccessGradient}>
                    <CheckCircle size={IconSizes.small} color="white" strokeWidth={STROKE_WIDTH} />
                    <Text style={styles.ocrSuccessText}>OCR Complete</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.captureOptions}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCameraPress}
                disabled={isProcessing}>
                <LinearGradient
                  colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
                  style={styles.captureGradient}>
                  <Camera size={IconSizes.xlarge} color="white" strokeWidth={STROKE_WIDTH} />
                  <Text style={styles.captureButtonText}>Take Photo & Analyze</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleGalleryPress}
                disabled={isProcessing}>
                <LinearGradient
                  colors={['rgba(20, 160, 133, 0.1)', 'rgba(20, 160, 133, 0.05)']}
                  style={styles.captureGradient}>
                  <ImageIcon size={IconSizes.xlarge} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                  <Text style={[styles.captureButtonText, { color: BrandColors.primaryGreen }]}>Choose from Gallery</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          
          {/* OCR Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={clearError} style={styles.errorButton}>
                <Text style={styles.errorButtonText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Document Information Section */}
        <Animated.View
          entering={FadeInUp.delay(150).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Document Information</Text>

          {/* Document Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Document Title *</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Blood Test Results"
                value={documentTitle}
                onChangeText={setDocumentTitle}
                placeholderTextColor={BrandColors.textSecondary}
              />
            </View>
          </View>

          {/* Category Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <TouchableOpacity
              style={styles.pickerContainer}
              onPress={() => setShowCategoryPicker(!showCategoryPicker)}>
              <Text style={[
                styles.pickerText,
                !selectedCategory && { color: BrandColors.textSecondary }
              ]}>
                {getSelectedCategoryLabel()}
              </Text>
              <ChevronDown 
                size={IconSizes.medium} 
                color={BrandColors.textSecondary} 
                strokeWidth={STROKE_WIDTH} 
              />
            </TouchableOpacity>

            {showCategoryPicker && (
              <Animated.View
                entering={FadeInDown.delay(50).springify()}
                style={styles.categoryDropdown}>
                {DOCUMENT_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryOption}
                    onPress={() => handleCategorySelect(category.id)}>
                    <category.icon 
                      size={IconSizes.medium} 
                      color={BrandColors.primaryGreen} 
                      strokeWidth={STROKE_WIDTH} 
                    />
                    <Text style={styles.categoryOptionText}>{category.label}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>

          {/* Document Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <View style={styles.inputContainer}>
              <Calendar 
                size={IconSizes.medium} 
                color={BrandColors.textSecondary} 
                strokeWidth={STROKE_WIDTH} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="DD/MM/YYYY"
                value={documentDate}
                onChangeText={handleDateChange}
                keyboardType="numeric"
                maxLength={10}
                placeholderTextColor={BrandColors.textSecondary}
              />
            </View>
          </View>

          {/* Provider */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Healthcare Provider</Text>
            <View style={styles.inputContainer}>
              <Hospital 
                size={IconSizes.medium} 
                color={BrandColors.textSecondary} 
                strokeWidth={STROKE_WIDTH} 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Hospital, clinic, or doctor name"
                value={provider}
                onChangeText={setProvider}
                placeholderTextColor={BrandColors.textSecondary}
              />
            </View>
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Notes (Optional)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Add any additional notes or context..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                placeholderTextColor={BrandColors.textSecondary}
                textAlignVertical="top"
              />
            </View>
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.saveSection}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isProcessing || isSaving}>
            <LinearGradient
              colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
              style={styles.saveGradient}>
              {isSaving ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.saveButtonText}>Saving...</Text>
                </>
              ) : (
                <>
                  <Save size={IconSizes.medium} color="white" strokeWidth={STROKE_WIDTH} />
                  <Text style={styles.saveButtonText}>
                    {extractedData ? 'Save Health Record (OCR Processed)' : 'Save Health Record'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Manual Text Entry Modal */}
      <Modal
        visible={showManualTextEntry}
        animationType="slide"
        presentationStyle="pageSheet">
        <LinearGradient
          colors={[BrandColors.cream, '#F8F4EB']}
          style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enter Document Text</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowManualTextEntry(false);
                setManualText('');
              }}>
              <X size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Since automatic OCR is not available, please manually type or paste the text from your medical document:
            </Text>
            
            <View style={styles.manualTextContainer}>
              <TextInput
                style={styles.manualTextInput}
                placeholder="Type or paste the document text here..."
                value={manualText}
                onChangeText={setManualText}
                multiline
                placeholderTextColor={BrandColors.textSecondary}
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.processTextButton}
                onPress={handleManualTextEntry}
                disabled={!manualText.trim()}>
                <LinearGradient
                  colors={[BrandColors.primaryGreen, BrandColors.deepTeal]}
                  style={styles.processTextGradient}>
                  <Sparkles size={IconSizes.medium} color="white" strokeWidth={STROKE_WIDTH} />
                  <Text style={styles.processTextButtonText}>Process Text</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 50, // Status bar padding
    paddingBottom: Spacing.lg,
  },
  headerTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
  },
  headerSpacer: {
    width: 40, // Same as BackArrow width for centering
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.lg,
  },

  // Document Capture Styles
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOptions: {
    gap: Spacing.md,
  },
  captureButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  captureGradient: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  captureButtonText: {
    ...Typography.ui.button,
    color: 'white',
  },

  // Input Styles
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
    fontFamily: 'Outfit-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  textInput: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    flex: 1,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Category Picker Styles
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  pickerText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    flex: 1,
  },
  categoryDropdown: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    marginTop: Spacing.sm,
    overflow: 'hidden',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 160, 133, 0.05)',
  },
  categoryOptionText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    marginLeft: Spacing.md,
  },

  // Save Button Styles
  saveSection: {
    marginTop: Spacing.lg,
  },
  saveButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  saveGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  saveButtonText: {
    ...Typography.ui.button,
    color: 'white',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 40,
  },

  // OCR Processing Styles
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  processingCard: {
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
    minWidth: 150,
  },
  processingText: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: `${BrandColors.textSecondary}15`,
    borderRadius: BorderRadius.sm,
  },
  cancelButtonText: {
    ...Typography.ui.labelSmall,
    color: BrandColors.textSecondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  ocrSuccessIndicator: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ocrSuccessGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
  },
  ocrSuccessText: {
    ...Typography.body.small,
    color: 'white',
    fontFamily: 'Outfit-Medium',
  },

  // Error Styles
  errorContainer: {
    backgroundColor: `${BrandColors.error}10`,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: `${BrandColors.error}30`,
  },
  errorText: {
    ...Typography.body.medium,
    color: BrandColors.error,
    marginBottom: Spacing.sm,
  },
  errorButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: BrandColors.error,
    borderRadius: BorderRadius.sm,
  },
  errorButtonText: {
    ...Typography.body.small,
    color: 'white',
    fontFamily: 'Outfit-Medium',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(20, 160, 133, 0.1)',
  },
  modalTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
  },
  modalCloseButton: {
    padding: Spacing.sm,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  modalDescription: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  manualTextContainer: {
    flex: 1,
    backgroundColor: BrandColors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(20, 160, 133, 0.1)',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  manualTextInput: {
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    flex: 1,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  modalButtonContainer: {
    paddingBottom: Spacing.xl,
  },
  processTextButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    shadowColor: BrandColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  processTextGradient: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  processTextButtonText: {
    ...Typography.ui.button,
    color: 'white',
  },
});