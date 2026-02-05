import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useProperty } from '../hooks';
import { ReportType, getReportTypeName } from '../types';
import { Card, Button, PhotoPicker, LocationPicker } from '../components';
import { AlertTriangle, Trash2, Bug, HelpCircle, CheckCircle } from 'lucide-react-native';

export function ReportIssueScreen() {
  const { colors, layout } = useTheme();
  const { selectedProperty } = useProperty();

  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [description, setDescription] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const reportTypes = [
    { type: ReportType.MISSED_COLLECTION, icon: Trash2, label: getReportTypeName(ReportType.MISSED_COLLECTION) },
    { type: ReportType.DAMAGED_BIN, icon: AlertTriangle, label: getReportTypeName(ReportType.DAMAGED_BIN) },
    { type: ReportType.FLY_TIPPING, icon: Bug, label: getReportTypeName(ReportType.FLY_TIPPING) },
    { type: ReportType.OTHER, icon: HelpCircle, label: getReportTypeName(ReportType.OTHER) },
  ];

  const handleSubmit = () => {
    if (!reportType) {
      Alert.alert('Error', 'Please select a report type');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  const resetForm = () => {
    setReportType(null);
    setDescription('');
    setPhotoUri(null);
    setLocation(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.success + '15' }]}>
            <CheckCircle size={48} color={colors.success} strokeWidth={1.5} />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Report Submitted
          </Text>
          <Text style={[styles.successMessage, { color: colors.textSecondary }]}>
            Thank you for reporting this issue. Our team will review it and take appropriate action.
          </Text>
          <Button
            title="Submit Another Report"
            variant="secondary"
            onPress={resetForm}
            style={styles.resetButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Report an Issue
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Let us know about problems with waste collection
            </Text>
          </View>

          {/* Report Type Selection */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What type of issue?
          </Text>
          <View style={styles.typeGrid}>
            {reportTypes.map(({ type, icon: Icon, label }) => {
              const isSelected = reportType === type;
              const cardStyle = isSelected
                ? { ...styles.typeCard, borderColor: colors.primary, borderWidth: 2 }
                : styles.typeCard;
              return (
              <Card
                key={type}
                variant={isSelected ? 'elevated' : 'outlined'}
                onPress={() => setReportType(type)}
                style={cardStyle}
              >
                <Icon
                  size={24}
                  color={isSelected ? colors.primary : colors.textSecondary}
                  strokeWidth={1.5}
                />
                <Text
                  style={[
                    styles.typeLabel,
                    { color: isSelected ? colors.primary : colors.textSecondary },
                  ]}
                >
                  {label}
                </Text>
              </Card>
            );})}
          </View>

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <View
            style={[
              styles.textInputContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: layout.radiusMedium,
              },
            ]}
          >
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Please describe the issue..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              style={[styles.textInput, { color: colors.text }]}
              textAlignVertical="top"
            />
          </View>

          {/* Property Address */}
          {selectedProperty && (
            <View style={[styles.addressCard, { backgroundColor: colors.surfaceSecondary, borderRadius: layout.radiusMedium }]}>
              <Text style={[styles.addressLabel, { color: colors.textSecondary }]}>
                Reporting for:
              </Text>
              <Text style={[styles.addressText, { color: colors.text }]}>
                {selectedProperty.address}, {selectedProperty.postcode}
              </Text>
            </View>
          )}

          {/* Photo */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Add a photo (optional)
          </Text>
          <PhotoPicker photoUri={photoUri} onPhotoSelected={setPhotoUri} />

          {/* Location */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Add location (optional)
          </Text>
          <LocationPicker location={location} onLocationSelected={setLocation} />

          {/* Submit Button */}
          <Button
            title="Submit Report"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!reportType || !description.trim()}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  typeCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  textInputContainer: {
    borderWidth: 1,
    marginBottom: 16,
  },
  textInput: {
    padding: 12,
    fontSize: 15,
    minHeight: 100,
  },
  addressCard: {
    padding: 12,
    marginBottom: 16,
  },
  addressLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 24,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  resetButton: {
    marginTop: 32,
  },
});
