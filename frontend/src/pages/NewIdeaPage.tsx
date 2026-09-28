import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';
import * as ideaService from '@/services/ideaService';
import { ApiClientError } from '@/services/apiClient';
import type { CreateIdeaInput } from '@/types/api';

const EMPTY_FORM: CreateIdeaInput = {
  startupName: '',
  ideaDescription: '',
  problem: '',
  targetCustomer: '',
  location: '',
  industry: '',
  businessModel: '',
  expectedPricing: '',
  existingCompetitors: '',
  uniqueSellingProposition: '',
  additionalInfo: ''
};

const FIELD_LABEL = 'block text-sm font-semibold text-ink-soft mb-1';
const INPUT = 'w-full rounded-lg border border-line bg-white px-4 py-2.5 focus:outline-none focus:border-emerald';

export function NewIdeaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<CreateIdeaInput>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function update<K extends keyof CreateIdeaInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const idea = await ideaService.createIdea(form);
      navigate(`/ideas/${idea.id}`);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        if (err.fieldErrors) {
          setFieldErrors(Object.fromEntries(err.fieldErrors.map((fe) => [fe.field, fe.message])));
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl md:text-3xl font-semibold text-ink mb-2">Describe your startup idea</h1>
      <p className="text-muted mb-8">
        The more specific you are, the more useful the analysis will be. Fields marked optional can be left blank.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={FIELD_LABEL} htmlFor="startupName">Startup Name</label>
          <input id="startupName" required className={INPUT} value={form.startupName} onChange={(e) => update('startupName', e.target.value)} />
          {fieldErrors.startupName && <p className="text-xs text-coral mt-1">{fieldErrors.startupName}</p>}
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="ideaDescription">Startup Idea</label>
          <textarea id="ideaDescription" required rows={4} className={INPUT} value={form.ideaDescription} onChange={(e) => update('ideaDescription', e.target.value)} />
          {fieldErrors.ideaDescription && <p className="text-xs text-coral mt-1">{fieldErrors.ideaDescription}</p>}
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="problem">Problem Being Solved</label>
          <textarea id="problem" required rows={3} className={INPUT} value={form.problem} onChange={(e) => update('problem', e.target.value)} />
          {fieldErrors.problem && <p className="text-xs text-coral mt-1">{fieldErrors.problem}</p>}
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="targetCustomer">Target Customer</label>
          <input id="targetCustomer" required className={INPUT} value={form.targetCustomer} onChange={(e) => update('targetCustomer', e.target.value)} />
          {fieldErrors.targetCustomer && <p className="text-xs text-coral mt-1">{fieldErrors.targetCustomer}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={FIELD_LABEL} htmlFor="location">Location / Target Market <span className="font-normal text-muted">(optional)</span></label>
            <input id="location" className={INPUT} value={form.location} onChange={(e) => update('location', e.target.value)} />
          </div>
          <div>
            <label className={FIELD_LABEL} htmlFor="industry">Industry</label>
            <input id="industry" required className={INPUT} value={form.industry} onChange={(e) => update('industry', e.target.value)} />
            {fieldErrors.industry && <p className="text-xs text-coral mt-1">{fieldErrors.industry}</p>}
          </div>
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="businessModel">Business Model</label>
          <textarea id="businessModel" required rows={2} className={INPUT} value={form.businessModel} onChange={(e) => update('businessModel', e.target.value)} />
          {fieldErrors.businessModel && <p className="text-xs text-coral mt-1">{fieldErrors.businessModel}</p>}
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="expectedPricing">Expected Pricing <span className="font-normal text-muted">(optional)</span></label>
          <input id="expectedPricing" className={INPUT} value={form.expectedPricing} onChange={(e) => update('expectedPricing', e.target.value)} />
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="existingCompetitors">Existing Competitors <span className="font-normal text-muted">(optional)</span></label>
          <input id="existingCompetitors" className={INPUT} value={form.existingCompetitors} onChange={(e) => update('existingCompetitors', e.target.value)} />
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="usp">Unique Selling Proposition <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="usp" rows={2} className={INPUT} value={form.uniqueSellingProposition} onChange={(e) => update('uniqueSellingProposition', e.target.value)} />
        </div>

        <div>
          <label className={FIELD_LABEL} htmlFor="additionalInfo">Additional Information <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="additionalInfo" rows={3} className={INPUT} value={form.additionalInfo} onChange={(e) => update('additionalInfo', e.target.value)} />
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save & Continue'}
        </Button>
      </form>
    </div>
  );
}
