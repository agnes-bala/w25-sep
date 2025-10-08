import { RHFAutocomplete } from './rhf-autocomplete';
import { RHFCountrySelect } from './rhf-country-select';
// import { RHFDatePicker } from './rhf-date-picker';
import { RHFSelect } from './rhf-select';
import { RHFTextField } from './rhf-text-field';
import { RHFUpload } from './rhf-upload';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  Select: RHFSelect,
  Autocomplete: RHFAutocomplete,
  CountrySelect: RHFCountrySelect,
  Upload: RHFUpload,
  // DatePicker: RHFDatePicker,
};
