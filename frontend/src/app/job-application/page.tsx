'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // Import useRouter for redirecting
import { strapiService } from '@/utils/strapi';

interface Experience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string;
}

interface JobForm {
  position: string;
  fullName: string;
  email: string;
  phone: string;
  address: string | null;
  dob: string | null;
  gender: string | null;
  skills: string;
  resume: File | null;
  coverLetter: File | null;
  jobExperience: Experience[];
}

const JobApplicationForm: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<JobForm>({
    position: '',
    fullName: '',
    email: '',
    phone: '',
    address: null,
    dob: null,
    gender: null,
    skills: '',
    resume: null,
    coverLetter: null,
    jobExperience: []
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);  // State to track submission
  const router = useRouter();  // useRouter for redirection

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
  
    if (files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  

  const validateStep = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.position) {
        errors.position = 'Please select a position.';
      }
      if (!formData.fullName) {
        errors.fullName = 'Full Name is required.';
      }
      if (!formData.email) {
        errors.email = 'Email is required.';
      }
      if (!formData.phone) {
        errors.phone = 'Phone number is required.';
      }
      if (!formData.dob) {
        errors.dob = 'Date of Birth is required.';
      }
      if (!formData.gender) {
        errors.gender = 'Gender is required.';
      }
    }

    if (step === 4) {
      if (!formData.skills) {
        errors.skills = 'Skills are required.';
      }
    }

    if (step === 5) {
      if (!formData.resume) {
        errors.resume = 'Resume is required.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const next = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleJobExperienceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Experience
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      jobExperience: [
        {
          ...prev.jobExperience[0] || {},
          [field]: value,
        }
      ],
    }));
  };
  

  const prev = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep()) return;

    setSubmitting(true);

    try {
      const resumeId = formData.resume ? await strapiService.uploadFile(formData.resume) : null;
      const coverLetterId = formData.coverLetter ? await strapiService.uploadFile(formData.coverLetter) : null;

      const payload = {
        position: formData.position,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dob: formData.dob,
        gender: formData.gender,
        skills: formData.skills,
        resume: resumeId,
        coverLetter: coverLetterId,
        jobExperience: formData.jobExperience
      };

      await strapiService.createJobApplication(payload);  // Now this is JSON
      alert('Application Submitted!');
      setIsSubmitted(true);  // Mark the form as submitted
      setSubmitting(false);

      setTimeout(() => {
        router.push('/');
      }, 3000);  
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="our_room">
        <div className='container'>
        <h3>Your application is being submitted...</h3>
        <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }
  // If the form is submitted, show a success message  

  if (isSubmitted) {
    // If the form is submitted, disable further interactions
    return (
      <div className="our_room">
        <div className='container'>
        <h2>Your application has been submitted successfully!</h2>
        <p>Thank you for applying. You will hear from us soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="our_room">
      <div className="container">
        <h2 className="mb-4">Job Application Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <>
              <div className="mb-4">
                <h4 className="mb-3">Position You are Applying For?</h4>
                <div className="row">
                  {[
                    "Receptionist", "Laundry", "Waiter/Waitress", "Bouncer", "Chef",
                    "Supervisor", "Porter", "Bar Attendant", "Pool Diver", "House Keeper",
                  ].map((role) => (
                    <div className="col-md-4 mb-2" key={role}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="position"
                          value={role}
                          id={role}
                          checked={formData.position === role}
                          onChange={handleChange}
                          disabled={isSubmitted}
                        />
                        <label className="form-check-label" htmlFor={role}>
                          {role}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                {formErrors.position && (
                  <div className="text-danger mt-1">{formErrors.position}</div>
                )}
              </div>
  
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input name="fullName" className="form-control" onChange={handleChange} disabled={isSubmitted} />
                {formErrors.fullName && <div className="text-danger mt-1">{formErrors.fullName}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" onChange={handleChange} disabled={isSubmitted} />
                {formErrors.email && <div className="text-danger mt-1">{formErrors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" onChange={handleChange} disabled={isSubmitted} />
                {formErrors.phone && <div className="text-danger mt-1">{formErrors.phone}</div>}
              </div>
  
              <div className="mb-3">
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dob" className="form-control" onChange={handleChange} disabled={isSubmitted} />
                {formErrors.dob && <div className="text-danger mt-1">{formErrors.dob}</div>}
              </div>
  
              <div className="mb-3">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-control" onChange={handleChange} disabled={isSubmitted}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formErrors.gender && <div className="text-danger mt-1">{formErrors.gender}</div>}
              </div>
  
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input name="address" className="form-control" onChange={handleChange} disabled={isSubmitted} />
              </div>
            </>
          )}
  
          {/* Step 2: Job Experience */}
          {step === 2 && (
            <>
              <h4 className="mb-3">Job Experience</h4>
              <div className="mb-3">
                <label className="form-label">Company Name</label>
                <input name="company" className="form-control" onChange={(e) => handleJobExperienceChange(e, 'company')} disabled={isSubmitted} />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <input name="role" className="form-control" onChange={(e) => handleJobExperienceChange(e, 'role')} disabled={isSubmitted} />
              </div>
              <div className="mb-3">
                <label className="form-label">Duration</label>
                <input name="duration" className="form-control" onChange={(e) => handleJobExperienceChange(e, 'duration')} disabled={isSubmitted} />
              </div>
              <div className="mb-3">
                <label className="form-label">Responsibilities</label>
                <textarea name="responsibilities" className="form-control" onChange={(e) => handleJobExperienceChange(e, 'responsibilities')} disabled={isSubmitted} />
              </div>
            </>
          )}
  
          {/* Step 3: Skills */}
          {step === 3 && (
            <>
              <h4 className="mb-3">Skills</h4>
              <div className="mb-3">
                <label className="form-label">Skills</label>
                <input name="skills" className="form-control" onChange={handleChange} disabled={isSubmitted} />
                {formErrors.skills && <div className="text-danger mt-1">{formErrors.skills}</div>}
              </div>
            </>
          )}
  
          {/* Step 4: Resume and Cover Letter Upload */}
          {step === 4 && (
            <>
              <h4 className="mb-3">Upload Your Resume and Cover Letter</h4>
              <div className="mb-3">
                <label className="form-label">Resume</label>
                <input type="file" name="resume" accept=".pdf, .doc, .docx" className="form-control" onChange={handleChange} disabled={isSubmitted} />
                {formErrors.resume && <div className="text-danger mt-1">{formErrors.resume}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Cover Letter</label>
                <input type="file" name="coverLetter" accept=".pdf, .doc, .docx" className="form-control" onChange={handleChange} disabled={isSubmitted} />
                {formErrors.coverLetter && <div className="text-danger mt-1">{formErrors.coverLetter}</div>}
              </div>
            </>
          )}
  
          {/* Step 5: Review and Submit */}
          {step === 5 && (
            <>
              <h4 className="mb-3">Review and Submit</h4>
              {["position", "fullName", "email", "phone", "address"].map((field) => {
                const value = formData[field as keyof JobForm];
                return (
                  <div className="mb-3" key={field}>
                    <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input value={typeof value === 'string' ? value : ''} className="form-control" disabled />
                  </div>
                );
              })}
            </>
          )}
  
          {/* Navigation Buttons */}
          <div className="mt-3">
            {step > 1 && step <= 5 && (
              <button
                type="button"
                className="btn btn-outline-secondary me-3"
                onClick={prev}
                disabled={isSubmitted}
              >
                Back
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={next}
                disabled={isSubmitted}
              >
                Next
              </button>
            )}
            {step === 5 && (
              <button type="submit" className="btn btn-success" disabled={isSubmitted}>
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
  };

export default JobApplicationForm;
