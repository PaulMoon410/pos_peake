import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch
} from 'react-native';

interface MerchantOnboardingData {
  businessName: string;
  businessType: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  acceptedPayments: string[];
  features: string[];
  description: string;
  operatingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
}

export const MerchantOnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [merchantData, setMerchantData] = useState<MerchantOnboardingData>({
    businessName: '',
    businessType: 'restaurant',
    address: '',
    phone: '',
    email: '',
    website: '',
    acceptedPayments: ['PEAK'],
    features: [],
    description: '',
    operatingHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: true },
    }
  });

  const businessTypes = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'retail', label: 'Retail Store' },
    { value: 'services', label: 'Services' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' }
  ];

  const availableFeatures = [
    { id: 'online_ordering', label: 'Online Ordering' },
    { id: 'delivery', label: 'Delivery' },
    { id: 'pickup', label: 'Pickup' },
    { id: 'dine_in', label: 'Dine In' },
    { id: 'wifi', label: 'Free WiFi' },
    { id: 'parking', label: 'Parking Available' },
    { id: 'outdoor_seating', label: 'Outdoor Seating' },
    { id: 'drive_through', label: 'Drive Through' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would submit to your backend API
      console.log('Submitting merchant data:', merchantData);
      
      Alert.alert(
        'Application Submitted!',
        'Thank you for your interest in accepting PeakeCoin. We will review your application and contact you within 2-3 business days.',
        [{ text: 'OK', onPress: () => {/* Navigate back */} }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    }
  };

  const toggleFeature = (featureId: string) => {
    const updatedFeatures = merchantData.features.includes(featureId)
      ? merchantData.features.filter(f => f !== featureId)
      : [...merchantData.features, featureId];
    
    setMerchantData({ ...merchantData, features: updatedFeatures });
  };

  const updateOperatingHours = (day: string, field: string, value: string | boolean) => {
    setMerchantData({
      ...merchantData,
      operatingHours: {
        ...merchantData.operatingHours,
        [day]: {
          ...merchantData.operatingHours[day],
          [field]: value
        }
      }
    });
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Information</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Business Name *"
        value={merchantData.businessName}
        onChangeText={(text) => setMerchantData({ ...merchantData, businessName: text })}
      />
      
      <Text style={styles.label}>Business Type *</Text>
      <View style={styles.businessTypeContainer}>
        {businessTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.businessTypeButton,
              merchantData.businessType === type.value && styles.selectedBusinessType
            ]}
            onPress={() => setMerchantData({ ...merchantData, businessType: type.value })}
          >
            <Text
              style={[
                styles.businessTypeText,
                merchantData.businessType === type.value && styles.selectedBusinessTypeText
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Business Address *"
        value={merchantData.address}
        onChangeText={(text) => setMerchantData({ ...merchantData, address: text })}
        multiline
        numberOfLines={3}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number *"
        value={merchantData.phone}
        onChangeText={(text) => setMerchantData({ ...merchantData, phone: text })}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Address *"
        value={merchantData.email}
        onChangeText={(text) => setMerchantData({ ...merchantData, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Website (optional)"
        value={merchantData.website}
        onChangeText={(text) => setMerchantData({ ...merchantData, website: text })}
        autoCapitalize="none"
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business Features</Text>
      
      <Text style={styles.label}>What features does your business offer?</Text>
      <View style={styles.featuresContainer}>
        {availableFeatures.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              styles.featureButton,
              merchantData.features.includes(feature.id) && styles.selectedFeature
            ]}
            onPress={() => toggleFeature(feature.id)}
          >
            <Text
              style={[
                styles.featureText,
                merchantData.features.includes(feature.id) && styles.selectedFeatureText
              ]}
            >
              {feature.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.label}>Business Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describe your business, cuisine type, specialties, etc."
        value={merchantData.description}
        onChangeText={(text) => setMerchantData({ ...merchantData, description: text })}
        multiline
        numberOfLines={4}
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Operating Hours</Text>
      
      {Object.entries(merchantData.operatingHours).map(([day, hours]) => (
        <View key={day} style={styles.hoursRow}>
          <Text style={styles.dayLabel}>
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Text>
          
          <Switch
            value={!hours.closed}
            onValueChange={(value) => updateOperatingHours(day, 'closed', !value)}
          />
          
          {!hours.closed && (
            <View style={styles.timeInputs}>
              <TextInput
                style={styles.timeInput}
                value={hours.open}
                onChangeText={(text) => updateOperatingHours(day, 'open', text)}
                placeholder="09:00"
              />
              <Text style={styles.timeSeparator}>to</Text>
              <TextInput
                style={styles.timeInput}
                value={hours.close}
                onChangeText={(text) => updateOperatingHours(day, 'close', text)}
                placeholder="17:00"
              />
            </View>
          )}
          
          {hours.closed && (
            <Text style={styles.closedText}>Closed</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Business Name:</Text>
        <Text style={styles.reviewValue}>{merchantData.businessName}</Text>
      </View>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Type:</Text>
        <Text style={styles.reviewValue}>
          {businessTypes.find(t => t.value === merchantData.businessType)?.label}
        </Text>
      </View>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Address:</Text>
        <Text style={styles.reviewValue}>{merchantData.address}</Text>
      </View>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Contact:</Text>
        <Text style={styles.reviewValue}>{merchantData.phone}</Text>
        <Text style={styles.reviewValue}>{merchantData.email}</Text>
      </View>
      
      <View style={styles.reviewSection}>
        <Text style={styles.reviewLabel}>Features:</Text>
        <Text style={styles.reviewValue}>
          {merchantData.features.map(f => 
            availableFeatures.find(af => af.id === f)?.label
          ).join(', ')}
        </Text>
      </View>
      
      <Text style={styles.termsText}>
        By submitting this application, you agree to PeakeCoin's merchant terms of service and privacy policy.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Become a PeakeCoin Merchant</Text>
        <Text style={styles.subtitle}>Step {currentStep} of 4</Text>
      </View>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === 4 ? 'Submit Application' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 20,
    marginTop: -2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginTop: 10,
  },
  businessTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  businessTypeButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedBusinessType: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  businessTypeText: {
    color: '#666',
    fontWeight: '500',
  },
  selectedBusinessTypeText: {
    color: '#fff',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  featureButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedFeature: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  featureText: {
    color: '#666',
    fontSize: 14,
  },
  selectedFeatureText: {
    color: '#fff',
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayLabel: {
    width: 80,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    width: 60,
    textAlign: 'center',
  },
  timeSeparator: {
    marginHorizontal: 10,
    color: '#666',
  },
  closedText: {
    flex: 1,
    marginLeft: 15,
    color: '#999',
    fontStyle: 'italic',
  },
  reviewSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  reviewValue: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  backButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 15,
    borderRadius: 8,
    backgroundColor: '#2196F3',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default MerchantOnboardingScreen;
