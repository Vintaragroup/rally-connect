import { useState } from 'react';
import { CodeEntryScreen } from './CodeEntryScreen';
import { OrganizationSelectionScreen } from './OrganizationSelectionScreen';
import { SimpleSportSelectionScreen } from './SimpleSportSelectionScreen';
import { OnboardingCompleteScreen } from './OnboardingCompleteScreen';

type OnboardingStep = 
  | 'code-entry'
  | 'organization-selection'
  | 'sport-selection'
  | 'complete';

interface SimplifiedOnboardingFlowProps {
  onComplete: () => void;
}

export function SimplifiedOnboardingFlow({ onComplete }: SimplifiedOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('code-entry');
  const [data, setData] = useState({
    code: null as string | null,
    organizationId: null as string | null,
    sportIds: [] as string[],
  });

  const handleCodeSubmit = (code: string) => {
    setData((prev) => ({ ...prev, code }));
    // After code submission, go to sport selection (org is auto-selected from code)
    setCurrentStep('sport-selection');
  };

  const handleCodeSkip = () => {
    // Skip code entry, go to manual org selection
    setCurrentStep('organization-selection');
  };

  const handleOrgSelect = (orgId: string) => {
    setData((prev) => ({ ...prev, organizationId: orgId }));
    setCurrentStep('sport-selection');
  };

  const handleSportSelect = (sportIds: string[]) => {
    setData((prev) => ({ ...prev, sportIds }));
    // TODO: Save onboarding data to backend
    // For now, just proceed to complete screen
    setCurrentStep('complete');
  };

  const handleBack = () => {
    if (currentStep === 'sport-selection') {
      // Go back to org selection if they skipped code, or code entry if they used code
      setCurrentStep(data.code ? 'code-entry' : 'organization-selection');
    } else if (currentStep === 'organization-selection') {
      setCurrentStep('code-entry');
    }
  };

  if (currentStep === 'code-entry') {
    return (
      <CodeEntryScreen
        onCodeSubmit={handleCodeSubmit}
        onSkip={handleCodeSkip}
      />
    );
  }

  if (currentStep === 'organization-selection') {
    return (
      <OrganizationSelectionScreen
        onSelect={handleOrgSelect}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === 'sport-selection') {
    return (
      <SimpleSportSelectionScreen
        organizationId={data.organizationId || 'unknown'}
        onComplete={handleSportSelect}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === 'complete') {
    return (
      <OnboardingCompleteScreen
        role="member"
        teamName="Your Organization"
        onComplete={onComplete}
        isReturningUser={false}
      />
    );
  }

  return null;
}
