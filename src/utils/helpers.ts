'use server';

import axios from 'axios';

import { config } from 'src/constants/helpers';

import { ignCountries } from '../constants/countries';

interface OptionValue {
  label: string;
  value: string;
}

interface PincodePrefixes {
  SD_Pincode: string;
}

export const getCountries = async () => {
  const countries = ignCountries.map((country) => ({
    label: country.label,
    value: country.value,
  }));
  return countries;
  // const result = await axios.get(`https://countriesnow.space/api/v0.1/countries`);
  // if (!result) {
  //   throw new Error('Failed to fetch countries');
  // }
  // const countries = result.data.data.map((item: { country: string }) => ({
  //   label: item.country,
  //   value: item.country,
  // }));
  // return countries;
};

export const getStates = async (country: string) => {
  const result = await axios.get(`${config.BASE_URL1}/lookup/states?country=${country}`);
  if (!result) {
    throw new Error('Failed to fetch states');
  }
  const states = result.data.stateList?.map((item: string) => ({
    label: item,
    value: item,
  }));
  return states;
};

export const getDistricts = async (country: string, state: string) => {
  try {
    const districtList: { label: string; value: string }[] = [];
    const result = await axios.get(
      `${config.BASE_URL1}/lookup/districts?country=${country}&state=${state}`
    );
    if (!result) {
      throw new Error('Failed to fetch districts');
    }
    result.data.districtList.map((item: string) => {
      if (item != "''") {
        districtList.push({
          label: item,
          value: item,
        });
      }
    });
    return districtList;
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

export const getMinistries = async () => {
  const response = await fetch(`${config.BASE_URL1}/partners/v1/ministry-contribution-list`);
  if (!response.ok) {
    throw new Error('Failed to fetch ministries');
  }
  const result = await response.json();
  const ministries = result.ministryContributionList.map((item: OptionValue) => ({
    label: item,
    value: item,
  }));
  return ministries;
};

export const getPincodePrefixes = async (district: string) => {
  try {
    const response = await fetch(
      `${config.BASE_URL1}/location/pincode-prefixes?district=${district}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch pincode prefixes');
    }
    const result = await response.json();
    const pincodePrefixes = result.map((item: PincodePrefixes) => item.SD_Pincode).join(',');
    return pincodePrefixes;
  } catch (error) {
    console.error('Error fetching pincode prefixes:', error);
    return '';
  }
};

export const getLastContributionDetails = async (value: string) => {
  try {
    const response = await fetch(`${config.BASE_URL1}/search/last-contrib?partnerNo=${value}`);
    if (!response.ok) {
      throw new Error('Failed to fetch last contribution details');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching last contribution details:', error);
    return null;
  }
};

export const getPartnerDetails = async (partnerNo: string) => {
  try {
    const response = await fetch(
      `${config.BASE_URL1}/search/users-by-partner-number?partner_number=${partnerNo}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch partner details');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching partner details:', error);
    return null;
  }
};

export const getPartnerDetailsByMobile = async (mobile: string) => {
  try {
    const response = await fetch(`${config.BASE_URL1}/search/users-by-mobile?mobile=${mobile}`);
    if (!response.ok) {
      throw new Error('Failed to fetch partner details');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching partner details:', error);
    return null;
  }
};

export const getPartnerDetailsByName = async (name: string, mobile: string) => {
  try {
    const response = await fetch(`${config.BASE_URL1}/search/users-by-name?name=${name}`);
    if (!response.ok) {
      throw new Error('Failed to fetch partner details');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching partner details:', error);
    return null;
  }
};

export const getFinancialYears = async () => {
  try {
    // const response = await fetch(`${config.BASE_URL1}/fetch-years`);
    // if (!response.ok) {
    //   throw new Error("Failed to fetch financial years");
    // }

    // const result = await response.json();
    const result = [
      { Entry_Year: '2020-2021' },
      { Entry_Year: '2021-2022' },
      { Entry_Year: '2022-2023' },
      { Entry_Year: '2023-2024' },
      { Entry_Year: '2024-2025' },
    ];
    const years = result.map((item) => ({
      label: item.Entry_Year,
      value: item.Entry_Year,
    }));
    return years;
  } catch (error) {
    console.error('Error fetching financial years:', error);
    return null;
  }
};

export const getDepartments = async (location: string, department: string) => {
  try {
    const response = await fetch(`${config.BASE_URL1}/fetch-departments?location=${location}`);
    if (!response.ok) {
      throw new Error('Failed to fetch departments');
    }
    const result = await response.json();
    const departments = result.map((item: { Dept: string }) => ({
      label: item.Dept,
      value: item.Dept,
    }));
    return departments;
  } catch (error) {
    console.error('Error fetching departments:', error);
    return null;
  }
};

export const getUsers = async (location: string, department: string) => {
  try {
    const response = await fetch(
      `${config.BASE_URL1}/fetch-users?location=${location}&department=${department}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const result = await response.json();
    const users = result.data.map((item: { Emp_Name: string }) => ({
      label: item.Emp_Name,
      value: item.Emp_Name,
    }));
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
};

export const getBranches = async (bank: string) => {
  try {
    const response = await fetch(`${config.BASE_URL1}/fetch-branches?bank=${bank}`);
    if (!response.ok) {
      throw new Error('Failed to fetch branches');
    }
    const result = await response.json();
    const branches = result.map((item: { Br_Name: string }) => ({
      label: item.Br_Name,
      value: item.Br_Name,
    }));
    return branches;
  } catch (error) {
    console.error('Error fetching branches:', error);
    return null;
  }
};

export const getAccounts = async (bank: string, branch: string) => {
  try {
    const response = await fetch(
      `${config.BASE_URL1}/fetch-accounts?bank=${bank}&branch=${branch}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch accounts');
    }
    const result = await response.json();
    const accounts = result.map((item: { Acc_Name: string; Acc_No: string }) => ({
      label: item.Acc_Name + ' - ' + String(item.Acc_No).slice(-4),
      value: item.Acc_No,
    }));
    return accounts;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return null;
  }
};

export const calcFinancialYear = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  let financialYear = year - 1;
  if (month >= 4) {
    financialYear = year;
  }
  const financialYearString = `${financialYear}-${financialYear + 1}`;
  return financialYearString;
};

// /pages/api/send-sms.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mobile, message } = req.body;

  const username = encodeURIComponent('jesusredeems');
  const password = encodeURIComponent('jesusredeems14sms');
  const domain = '180.179.33.131/boansms/boansmsinterface.aspx';
  const url = `http://${domain}/pushsms.php`;

  const formData = new URLSearchParams();
  formData.append('MobileNo', mobile);
  formData.append('smsMsg', encodeURIComponent(message));
  formData.append('PId', '390');
  formData.append('Uname', username);
  formData.append('Pwd', password);

  try {
    const smsRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const text = await smsRes.text();
    console.log(`SMS to ${mobile}: ${text}`);
    res.status(200).json({ success: true, response: text });
  } catch (err: any) {
    console.error(`Failed to send SMS to ${mobile}`, err);
    res.status(500).json({ success: false, error: err.message });
  }
}
