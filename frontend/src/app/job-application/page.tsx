'use client'
import React, { useState } from 'react';

interface Experience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string;
}

interface FormData {
  position: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  degree: string;
  field: string;
  institution: string;
  graduationYear: string;
  experience: Experience[];
  skills: string;
  resume: File | null;
  coverLetter: File | null;
}

const JobApplicationForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<FormData>({
    position: '',
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    degree: '',
    field: '',
    institution: '',
    graduationYear: '',
    experience: [{ company: '', role: '', duration: '', responsibilities: '' }],
    skills: '',
    resume: null,
    coverLetter: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const files = (e.target as HTMLInputElement).files;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleExperienceChange = (index: number, field: keyof Experience, value: string) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', duration: '', responsibilities: '' }],
    });
  };

  const validateStep = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.position) {
        errors.position = 'Please select a position.';
      }
      if (!formData.name) {
        errors.name = 'Name is required.';
      }
      if (!formData.email) {
        errors.email = 'Email is required.';
      }
      if (!formData.phone) {
        errors.phone = 'Phone number is required.';
      }
    //   if (!formData.linkedin) {
    //     errors.linkedin = 'LinkedIn profile is required.';
    //   }
    //   if (!formData.portfolio) {
    //     errors.portfolio = 'Portfolio link is required.';
    //   }
    }

    if (step === 2) {
      if (!formData.degree) {
        errors.degree = 'Degree is required.';
      }
      if (!formData.field) {
        errors.field = 'Field of study is required.';
      }
      if (!formData.institution) {
        errors.institution = 'Institution is required.';
      }
      if (!formData.graduationYear) {
        errors.graduationYear = 'Graduation year is required.';
      }
    }

    if (step === 3) {
      formData.experience.forEach((exp, index) => {
        if (!exp.company) {
          errors[`experience-company-${index}`] = 'Company name is required.';
        }
        if (!exp.role) {
          errors[`experience-role-${index}`] = 'Role is required.';
        }
        if (!exp.duration) {
          errors[`experience-duration-${index}`] = 'Duration is required.';
        }
        if (!exp.responsibilities) {
          errors[`experience-responsibilities-${index}`] = 'Responsibilities are required.';
        }
      });
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

  const prev = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Application Submitted!');
    console.log('Submitted data:', formData);
  };

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
                  {["Receptionist", "Laundry", "Waiter/Waitress", "Bouncer", "Chef", "Supervisor", "Porter", "Bar Attendant", "Pool Diver", "House Keeper"].map((role) => (
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
                <input name="name" className="form-control" onChange={handleChange} />
                {formErrors.name && <div className="text-danger mt-1">{formErrors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input name="email" type="email" className="form-control" onChange={handleChange} />
                {formErrors.email && <div className="text-danger mt-1">{formErrors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input name="phone" className="form-control" onChange={handleChange} />
                {formErrors.phone && <div className="text-danger mt-1">{formErrors.phone}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">LinkedIn</label>
                <input name="linkedin" className="form-control" onChange={handleChange} />
                {formErrors.linkedin && <div className="text-danger mt-1">{formErrors.linkedin}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Portfolio</label>
                <input name="portfolio" className="form-control" onChange={handleChange} />
                {formErrors.portfolio && <div className="text-danger mt-1">{formErrors.portfolio}</div>}
              </div>
            </>
          )}

          {/* Step 2 - 6: Same as before, no changes */}
          {step === 2 && (
            <>
              <div className="mb-3"><label className="form-label">Degree</label><input name="degree" className="form-control" onChange={handleChange} /></div>
              {formErrors.degree && <div className="text-danger mt-1">{formErrors.degree}</div>}
              <div className="mb-3"><label className="form-label">Field</label><input name="field" className="form-control" onChange={handleChange} /></div>
              {formErrors.field && <div className="text-danger mt-1">{formErrors.field}</div>}
              <div className="mb-3"><label className="form-label">Institution</label><input name="institution" className="form-control" onChange={handleChange} /></div>
              {formErrors.institution && <div className="text-danger mt-1">{formErrors.institution}</div>}
              <div className="mb-3"><label className="form-label">Graduation Year</label><input name="graduationYear" className="form-control" onChange={handleChange} /></div>
              {formErrors.graduationYear && <div className="text-danger mt-1">{formErrors.graduationYear}</div>}
            </>
          )}

          {step === 3 && (
            <>
              {formData.experience.map((exp, i) => (
                <div key={i} className="border p-3 mb-3 rounded">
                  <div className="mb-2"><label>Company</label><input className="form-control" value={exp.company} onChange={(e) => handleExperienceChange(i, 'company', e.target.value)} /></div>
                  {formErrors[`experience-company-${i}`] && <div className="text-danger mt-1">{formErrors[`experience-company-${i}`]}</div>}
                  <div className="mb-2"><label>Role</label><input className="form-control" value={exp.role} onChange={(e) => handleExperienceChange(i, 'role', e.target.value)} /></div>
                  {formErrors[`experience-role-${i}`] && <div className="text-danger mt-1">{formErrors[`experience-role-${i}`]}</div>}
                  <div className="mb-2"><label>Duration</label><input className="form-control" value={exp.duration} onChange={(e) => handleExperienceChange(i, 'duration', e.target.value)} /></div>
                  {formErrors[`experience-duration-${i}`] && <div className="text-danger mt-1">{formErrors[`experience-duration-${i}`]}</div>}
                  <div className="mb-2"><label>Responsibilities</label><textarea className="form-control" value={exp.responsibilities} onChange={(e) => handleExperienceChange(i, 'responsibilities', e.target.value)} /></div>
                  {formErrors[`experience-responsibilities-${i}`] && <div className="text-danger mt-1">{formErrors[`experience-responsibilities-${i}`]}</div>}
                </div>
              ))}
              <button type="button" className="btn btn-outline-primary mb-3" onClick={addExperience}>+ Add Experience</button>
            </>
          )}

          {step === 4 && (
            <div className="mb-3">
              <label className="form-label">Skills (comma separated)</label>
              <input name="skills" className="form-control" onChange={handleChange} />
              {formErrors.skills && <div className="text-danger mt-1">{formErrors.skills}</div>}
            </div>
          )}

          {step === 5 && (
            <>
              <div className="mb-3"><label>Resume</label><input type="file" name="resume" className="form-control" onChange={handleChange} /></div>
              {formErrors.resume && <div className="text-danger mt-1">{formErrors.resume}</div>}
              <div className="mb-3"><label>Cover Letter (optional)</label><input type="file" name="coverLetter" className="form-control" onChange={handleChange} /></div>
            </>
          )}

          {step === 6 && (
            <div>
              <h5>Review Your Application</h5>
              <div className="mb-3">
                <strong>Position: </strong>{formData.position}
              </div>
              <div className="mb-3">
                <strong>Name: </strong>{formData.name}
              </div>
              <div className="mb-3">
                <strong>Email: </strong>{formData.email}
              </div>
              {/* Add other fields for review here */}
            </div>
          )}

          <div className="mt-3">
            {step > 1 && <button type="button" className="btn btn-outline-secondary me-3" onClick={prev}>Back</button>}
            {step < 6 ? (
              <button type="button" className="btn btn-primary" onClick={next}>Next</button>
            ) : (
              <button type="submit" className="btn btn-success">Submit</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
