import { describe, expect, it } from 'vitest';
import { normalizeEmployeeInput, validateEmployee } from './employeeValidation';

const existingEmployees = [
  {
    code: 'EMP001',
    fullName: 'Jane Doe',
    occupation: 'Nurse',
    department: 'Clinical',
    dateOfEmployment: '2019-01-01',
    terminationDate: null,
  },
];

const validPayload = {
  code: 'EMP002',
  fullName: 'New Hire',
  occupation: 'Support',
  department: 'IT',
  dateOfEmployment: '2022-06-01',
  terminationDate: '',
};

function validate(payload, options = {}) {
  return validateEmployee(payload, existingEmployees, options);
}

describe('employeeValidation', () => {
  describe('normalizeEmployeeInput', () => {
    it('trims text fields and normalizes termination date', () => {
      expect(
        normalizeEmployeeInput({
          code: ' EMP002 ',
          fullName: ' John Smith ',
          occupation: ' IT ',
          department: ' Logistics ',
          dateOfEmployment: '2020-01-01',
          terminationDate: '',
        })
      ).toEqual({
        code: 'EMP002',
        fullName: 'John Smith',
        occupation: 'IT',
        department: 'Logistics',
        dateOfEmployment: '2020-01-01',
        terminationDate: null,
      });
    });
  });

  describe('validateEmployee', () => {
    it('returns no errors for a valid payload', () => {
      const { errors } = validate(validPayload);

      expect(errors).toEqual({});
    });

    it.each([
      ['code', 'code', { ...validPayload, code: '' }, 'Code is required.'],
      ['fullName', 'fullName', { ...validPayload, fullName: '' }, 'Full name is required.'],
      [
        'fullName minimum length',
        'fullName',
        { ...validPayload, fullName: 'A' },
        'Full name must be at least 2 characters.',
      ],
      ['occupation', 'occupation', { ...validPayload, occupation: '' }, 'Occupation is required.'],
      ['department', 'department', { ...validPayload, department: '' }, 'Department is required.'],
      [
        'employment date',
        'dateOfEmployment',
        { ...validPayload, dateOfEmployment: 'not-a-date' },
        'Date of employment must be a valid date.',
      ],
      [
        'termination date',
        'terminationDate',
        { ...validPayload, terminationDate: 'not-a-date' },
        'Termination date must be a valid date.',
      ],
    ])('validates %s', (_label, errorKey, payload, message) => {
      const { errors } = validate(payload);

      expect(errors[errorKey]).toBe(message);
    });

    it('rejects duplicate employee codes on create (case-insensitive)', () => {
      const { errors } = validate({ ...validPayload, code: 'emp001' });

      expect(errors.code).toBe('Code must be unique.');
    });

    it('allows the current code when editing', () => {
      const { errors } = validate(
        {
          code: 'EMP001',
          fullName: 'Jane Doe Updated',
          occupation: 'Nurse',
          department: 'Clinical',
          dateOfEmployment: '2019-01-01',
          terminationDate: '',
        },
        { currentCode: 'EMP001' }
      );

      expect(errors.code).toBeUndefined();
    });

    it('rejects termination date before employment date', () => {
      const { errors } = validate({
        ...validPayload,
        dateOfEmployment: '2022-06-01',
        terminationDate: '2022-01-01',
      });

      expect(errors.terminationDate).toBe(
        'Termination date cannot be earlier than date of employment.'
      );
    });
  });
});
