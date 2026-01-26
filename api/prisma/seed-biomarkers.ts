import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface BiomarkerSeed {
  code: string;
  name: string;
  category: string;
  subcategory?: string;
  defaultUnit: string;
  optimalRangeLow?: number;
  optimalRangeHigh?: number;
  refRangeLow?: number;
  refRangeHigh?: number;
  genderSpecificRanges?: object;
  description?: string;
  aliases: {
    labProvider: string;
    aliasName: string;
    aliasCode?: string;
    labUnit?: string;
    conversionFactor?: number;
    labRefRangeLow?: number;
    labRefRangeHigh?: number;
  }[];
}

const biomarkers: BiomarkerSeed[] = [
  // ===========================================
  // HORMONE PROFILE - ANDROGENS
  // ===========================================
  {
    code: 'TOTAL_TESTOSTERONE',
    name: 'Total Testosterone',
    category: 'Hormone Profile',
    subcategory: 'Androgens',
    defaultUnit: 'ng/dL',
    optimalRangeLow: 600,
    optimalRangeHigh: 900,
    refRangeLow: 264,
    refRangeHigh: 916,
    genderSpecificRanges: {
      MALE: { refLow: 264, refHigh: 916, optimalLow: 600, optimalHigh: 900 },
      FEMALE: { refLow: 8, refHigh: 60, optimalLow: 20, optimalHigh: 50 },
    },
    description: 'Primary male sex hormone. Key marker for TRT monitoring.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Testosterone, Total', aliasCode: '873' },
      { labProvider: 'QUEST', aliasName: 'Testosterone,Total,S', aliasCode: '873' },
      { labProvider: 'LABCORP', aliasName: 'Testosterone, Total, Serum', aliasCode: '004226' },
      { labProvider: 'LABCORP', aliasName: 'Testosterone, Total', aliasCode: '004226' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Total Testosterone' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Testosterone Total' },
    ],
  },
  {
    code: 'FREE_TESTOSTERONE',
    name: 'Free Testosterone',
    category: 'Hormone Profile',
    subcategory: 'Androgens',
    defaultUnit: 'pg/mL',
    optimalRangeLow: 15,
    optimalRangeHigh: 25,
    refRangeLow: 6.8,
    refRangeHigh: 21.5,
    genderSpecificRanges: {
      MALE: { refLow: 6.8, refHigh: 21.5, optimalLow: 15, optimalHigh: 25 },
      FEMALE: { refLow: 0.2, refHigh: 5.0, optimalLow: 1.0, optimalHigh: 3.5 },
    },
    description: 'Bioavailable testosterone not bound to proteins.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Testosterone, Free', aliasCode: '36170' },
      { labProvider: 'QUEST', aliasName: 'Testosterone,Free,S', aliasCode: '36170' },
      { labProvider: 'LABCORP', aliasName: 'Testosterone, Free, Direct', aliasCode: '144899' },
      { labProvider: 'LABCORP', aliasName: 'Free Testosterone, Direct', aliasCode: '144899' },
      { labProvider: 'LABCORP', aliasName: 'Free Testosterone(Direct)', aliasCode: '144899' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Free Testosterone' },
    ],
  },
  {
    code: 'BIOAVAILABLE_TESTOSTERONE',
    name: 'Bioavailable Testosterone',
    category: 'Hormone Profile',
    subcategory: 'Androgens',
    defaultUnit: 'ng/dL',
    optimalRangeLow: 150,
    optimalRangeHigh: 350,
    refRangeLow: 110,
    refRangeHigh: 575,
    description: 'Testosterone not bound to SHBG, includes albumin-bound.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Testosterone, Bioavailable', aliasCode: '36171' },
      { labProvider: 'QUEST', aliasName: 'TESTOSTERONE,BIOAVAILABLE', aliasCode: '36171' },
      { labProvider: 'LABCORP', aliasName: 'Testosterone, Bioavailable', aliasCode: '070038' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Bioavailable Testosterone' },
    ],
  },
  {
    code: 'SHBG',
    name: 'Sex Hormone Binding Globulin',
    category: 'Hormone Profile',
    subcategory: 'Androgens',
    defaultUnit: 'nmol/L',
    optimalRangeLow: 20,
    optimalRangeHigh: 50,
    refRangeLow: 16.5,
    refRangeHigh: 55.9,
    description: 'Protein that binds testosterone. High SHBG reduces free T.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Sex Hormone Binding Globulin', aliasCode: '30740' },
      { labProvider: 'QUEST', aliasName: 'SHBG', aliasCode: '30740' },
      { labProvider: 'LABCORP', aliasName: 'Sex Horm Binding Glob, Serum', aliasCode: '082016' },
      { labProvider: 'LABCORP', aliasName: 'SHBG', aliasCode: '082016' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'SHBG' },
    ],
  },
  {
    code: 'DHT',
    name: 'Dihydrotestosterone',
    category: 'Hormone Profile',
    subcategory: 'Androgens',
    defaultUnit: 'ng/dL',
    optimalRangeLow: 30,
    optimalRangeHigh: 85,
    refRangeLow: 30,
    refRangeHigh: 85,
    description: 'Potent androgen converted from testosterone by 5-alpha reductase.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Dihydrotestosterone', aliasCode: '36172' },
      { labProvider: 'QUEST', aliasName: 'DHT', aliasCode: '36172' },
      { labProvider: 'LABCORP', aliasName: 'Dihydrotestosterone', aliasCode: '500142' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'DHT' },
    ],
  },
  {
    code: 'DHEA_S',
    name: 'DHEA-Sulfate',
    category: 'Hormone Profile',
    subcategory: 'Androgens',
    defaultUnit: 'mcg/dL',
    optimalRangeLow: 300,
    optimalRangeHigh: 500,
    refRangeLow: 138.5,
    refRangeHigh: 475.2,
    genderSpecificRanges: {
      MALE: { refLow: 138.5, refHigh: 475.2, optimalLow: 300, optimalHigh: 500 },
      FEMALE: { refLow: 45, refHigh: 320, optimalLow: 150, optimalHigh: 300 },
    },
    description: 'Adrenal androgen precursor. Marker of adrenal function.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'DHEA Sulfate', aliasCode: '402' },
      { labProvider: 'QUEST', aliasName: 'DHEA-S', aliasCode: '402' },
      { labProvider: 'LABCORP', aliasName: 'DHEA-Sulfate', aliasCode: '004020' },
      { labProvider: 'LABCORP', aliasName: 'Dehydroepiandrosterone Sulfate', aliasCode: '004020' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'DHEA-S' },
    ],
  },

  // ===========================================
  // HORMONE PROFILE - ESTROGENS
  // ===========================================
  {
    code: 'ESTRADIOL',
    name: 'Estradiol',
    category: 'Hormone Profile',
    subcategory: 'Estrogens',
    defaultUnit: 'pg/mL',
    optimalRangeLow: 20,
    optimalRangeHigh: 35,
    refRangeLow: 7.6,
    refRangeHigh: 42.6,
    genderSpecificRanges: {
      MALE: { refLow: 7.6, refHigh: 42.6, optimalLow: 20, optimalHigh: 35 },
      FEMALE: { refLow: 12.5, refHigh: 498, optimalLow: 50, optimalHigh: 200 },
    },
    description: 'Primary estrogen. Important to monitor during TRT.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Estradiol', aliasCode: '4021' },
      { labProvider: 'QUEST', aliasName: 'Estradiol,S', aliasCode: '4021' },
      { labProvider: 'LABCORP', aliasName: 'Estradiol', aliasCode: '004515' },
      { labProvider: 'LABCORP', aliasName: 'Estradiol, Serum', aliasCode: '004515' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Estradiol' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'E2' },
    ],
  },
  {
    code: 'ESTRADIOL_SENSITIVE',
    name: 'Estradiol, Sensitive',
    category: 'Hormone Profile',
    subcategory: 'Estrogens',
    defaultUnit: 'pg/mL',
    optimalRangeLow: 20,
    optimalRangeHigh: 35,
    refRangeLow: 8,
    refRangeHigh: 35,
    description: 'More accurate estradiol test for males using LC/MS.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Estradiol, Sensitive (LC/MS)', aliasCode: '30289' },
      { labProvider: 'QUEST', aliasName: 'Estradiol, Ultrasensitive', aliasCode: '30289' },
      { labProvider: 'LABCORP', aliasName: 'Estradiol, Sensitive (LC/MS/MS)', aliasCode: '140244' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Estradiol Sensitive' },
    ],
  },
  {
    code: 'ESTRONE',
    name: 'Estrone',
    category: 'Hormone Profile',
    subcategory: 'Estrogens',
    defaultUnit: 'pg/mL',
    optimalRangeLow: 15,
    optimalRangeHigh: 65,
    refRangeLow: 15,
    refRangeHigh: 65,
    description: 'Weaker estrogen, often elevated in obesity.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Estrone', aliasCode: '4022' },
      { labProvider: 'LABCORP', aliasName: 'Estrone, Serum', aliasCode: '004564' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Estrone' },
    ],
  },

  // ===========================================
  // HORMONE PROFILE - PITUITARY/GONADAL AXIS
  // ===========================================
  {
    code: 'LH',
    name: 'Luteinizing Hormone',
    category: 'Hormone Profile',
    subcategory: 'Pituitary',
    defaultUnit: 'mIU/mL',
    optimalRangeLow: 2,
    optimalRangeHigh: 9,
    refRangeLow: 1.7,
    refRangeHigh: 8.6,
    description: 'Pituitary hormone stimulating testosterone production.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'LH', aliasCode: '877' },
      { labProvider: 'QUEST', aliasName: 'Luteinizing Hormone (LH)', aliasCode: '877' },
      { labProvider: 'LABCORP', aliasName: 'LH', aliasCode: '004283' },
      { labProvider: 'LABCORP', aliasName: 'Luteinizing Hormone (LH), S', aliasCode: '004283' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'LH' },
    ],
  },
  {
    code: 'FSH',
    name: 'Follicle Stimulating Hormone',
    category: 'Hormone Profile',
    subcategory: 'Pituitary',
    defaultUnit: 'mIU/mL',
    optimalRangeLow: 1.5,
    optimalRangeHigh: 12,
    refRangeLow: 1.5,
    refRangeHigh: 12.4,
    description: 'Pituitary hormone affecting sperm production.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'FSH', aliasCode: '7137' },
      { labProvider: 'QUEST', aliasName: 'Follicle Stimulating Hormone (FSH)', aliasCode: '7137' },
      { labProvider: 'LABCORP', aliasName: 'FSH', aliasCode: '004309' },
      { labProvider: 'LABCORP', aliasName: 'Follicle Stimulating Hormone (FSH), S', aliasCode: '004309' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'FSH' },
    ],
  },
  {
    code: 'PROLACTIN',
    name: 'Prolactin',
    category: 'Hormone Profile',
    subcategory: 'Pituitary',
    defaultUnit: 'ng/mL',
    optimalRangeLow: 2,
    optimalRangeHigh: 15,
    refRangeLow: 4,
    refRangeHigh: 15.2,
    genderSpecificRanges: {
      MALE: { refLow: 4, refHigh: 15.2, optimalLow: 2, optimalHigh: 12 },
      FEMALE: { refLow: 4.8, refHigh: 23.3, optimalLow: 5, optimalHigh: 20 },
    },
    description: 'Elevated prolactin can suppress testosterone.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Prolactin', aliasCode: '746' },
      { labProvider: 'LABCORP', aliasName: 'Prolactin', aliasCode: '004465' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Prolactin' },
    ],
  },
  {
    code: 'PROGESTERONE',
    name: 'Progesterone',
    category: 'Hormone Profile',
    subcategory: 'Progestogens',
    defaultUnit: 'ng/mL',
    optimalRangeLow: 0.2,
    optimalRangeHigh: 1.4,
    refRangeLow: 0.2,
    refRangeHigh: 1.4,
    description: 'Steroid hormone with neuroprotective effects.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Progesterone', aliasCode: '838' },
      { labProvider: 'LABCORP', aliasName: 'Progesterone', aliasCode: '004317' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Progesterone' },
    ],
  },

  // ===========================================
  // THYROID PANEL
  // ===========================================
  {
    code: 'TSH',
    name: 'Thyroid Stimulating Hormone',
    category: 'Thyroid',
    defaultUnit: 'uIU/mL',
    optimalRangeLow: 0.5,
    optimalRangeHigh: 2.0,
    refRangeLow: 0.45,
    refRangeHigh: 4.5,
    description: 'Primary marker of thyroid function.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'TSH', aliasCode: '899' },
      { labProvider: 'QUEST', aliasName: 'Thyroid Stimulating Hormone (TSH)', aliasCode: '899' },
      { labProvider: 'LABCORP', aliasName: 'TSH', aliasCode: '004259' },
      { labProvider: 'LABCORP', aliasName: 'Thyroid Stimulating Hormone', aliasCode: '004259' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'TSH' },
    ],
  },
  {
    code: 'FREE_T4',
    name: 'Free T4',
    category: 'Thyroid',
    defaultUnit: 'ng/dL',
    optimalRangeLow: 1.0,
    optimalRangeHigh: 1.5,
    refRangeLow: 0.82,
    refRangeHigh: 1.77,
    description: 'Active thyroid hormone (thyroxine).',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'T4, Free', aliasCode: '866' },
      { labProvider: 'QUEST', aliasName: 'Free T4', aliasCode: '866' },
      { labProvider: 'LABCORP', aliasName: 'T4, Free (Direct)', aliasCode: '001974' },
      { labProvider: 'LABCORP', aliasName: 'T4,Free(Direct)', aliasCode: '001974' },
      { labProvider: 'LABCORP', aliasName: 'Free T4', aliasCode: '001974' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Free T4' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'FT4' },
    ],
  },
  {
    code: 'FREE_T3',
    name: 'Free T3',
    category: 'Thyroid',
    defaultUnit: 'pg/mL',
    optimalRangeLow: 3.0,
    optimalRangeHigh: 4.0,
    refRangeLow: 2.0,
    refRangeHigh: 4.4,
    description: 'Most active thyroid hormone (triiodothyronine).',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'T3, Free', aliasCode: '34429' },
      { labProvider: 'QUEST', aliasName: 'Free T3', aliasCode: '34429' },
      { labProvider: 'LABCORP', aliasName: 'T3, Free', aliasCode: '010389' },
      { labProvider: 'LABCORP', aliasName: 'Triiodothyronine, Free, Serum', aliasCode: '010389' },
      { labProvider: 'LABCORP', aliasName: 'Triiodothyronine (T3), Free', aliasCode: '010389' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Free T3' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'FT3' },
    ],
  },
  {
    code: 'TOTAL_T4',
    name: 'Total T4',
    category: 'Thyroid',
    defaultUnit: 'ug/dL',
    optimalRangeLow: 6.0,
    optimalRangeHigh: 10.0,
    refRangeLow: 4.5,
    refRangeHigh: 12.0,
    description: 'Total thyroxine including protein-bound.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'T4, Total', aliasCode: '867' },
      { labProvider: 'QUEST', aliasName: 'Thyroxine (T4)', aliasCode: '867' },
      { labProvider: 'LABCORP', aliasName: 'T4 (Thyroxine), Total', aliasCode: '001149' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Total T4' },
    ],
  },
  {
    code: 'TOTAL_T3',
    name: 'Total T3',
    category: 'Thyroid',
    defaultUnit: 'ng/dL',
    optimalRangeLow: 100,
    optimalRangeHigh: 180,
    refRangeLow: 71,
    refRangeHigh: 180,
    description: 'Total triiodothyronine including protein-bound.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'T3, Total', aliasCode: '859' },
      { labProvider: 'QUEST', aliasName: 'Triiodothyronine (T3)', aliasCode: '859' },
      { labProvider: 'LABCORP', aliasName: 'T3, Total', aliasCode: '002188' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Total T3' },
    ],
  },
  {
    code: 'REVERSE_T3',
    name: 'Reverse T3',
    category: 'Thyroid',
    defaultUnit: 'ng/dL',
    optimalRangeLow: 10,
    optimalRangeHigh: 20,
    refRangeLow: 9.2,
    refRangeHigh: 24.1,
    description: 'Inactive form of T3. Elevated in stress/illness.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Reverse T3', aliasCode: '34432' },
      { labProvider: 'QUEST', aliasName: 'T3 Reverse', aliasCode: '34432' },
      { labProvider: 'LABCORP', aliasName: 'T3, Reverse, LC/MS/MS', aliasCode: '070104' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Reverse T3' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'rT3' },
    ],
  },
  {
    code: 'TPO_ANTIBODIES',
    name: 'Thyroid Peroxidase Antibodies',
    category: 'Thyroid',
    defaultUnit: 'IU/mL',
    optimalRangeLow: 0,
    optimalRangeHigh: 9,
    refRangeLow: 0,
    refRangeHigh: 34,
    description: 'Autoimmune marker for Hashimoto\'s thyroiditis.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Thyroid Peroxidase Antibodies (TPO)', aliasCode: '7260' },
      { labProvider: 'QUEST', aliasName: 'TPO Antibodies', aliasCode: '7260' },
      { labProvider: 'LABCORP', aliasName: 'Thyroid Peroxidase (TPO) Ab', aliasCode: '006676' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'TPO Antibodies' },
    ],
  },
  {
    code: 'THYROGLOBULIN_AB',
    name: 'Thyroglobulin Antibodies',
    category: 'Thyroid',
    defaultUnit: 'IU/mL',
    optimalRangeLow: 0,
    optimalRangeHigh: 1,
    refRangeLow: 0,
    refRangeHigh: 4,
    description: 'Autoimmune marker for thyroid disease.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Thyroglobulin Antibodies', aliasCode: '265' },
      { labProvider: 'LABCORP', aliasName: 'Thyroglobulin Antibody', aliasCode: '006685' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Thyroglobulin Antibodies' },
    ],
  },

  // ===========================================
  // METABOLIC PANEL
  // ===========================================
  {
    code: 'GLUCOSE',
    name: 'Glucose',
    category: 'Metabolic',
    subcategory: 'Blood Sugar',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 70,
    optimalRangeHigh: 90,
    refRangeLow: 65,
    refRangeHigh: 99,
    description: 'Fasting blood sugar. Key marker for diabetes risk.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Glucose', aliasCode: '483' },
      { labProvider: 'QUEST', aliasName: 'Glucose, Fasting', aliasCode: '483' },
      { labProvider: 'LABCORP', aliasName: 'Glucose', aliasCode: '001032' },
      { labProvider: 'LABCORP', aliasName: 'Glucose, Serum', aliasCode: '001032' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Glucose' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Fasting Glucose' },
    ],
  },
  {
    code: 'HBA1C',
    name: 'Hemoglobin A1c',
    category: 'Metabolic',
    subcategory: 'Blood Sugar',
    defaultUnit: '%',
    optimalRangeLow: 4.8,
    optimalRangeHigh: 5.3,
    refRangeLow: 4.8,
    refRangeHigh: 5.6,
    description: '3-month average blood sugar. Best marker for diabetes.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Hemoglobin A1c', aliasCode: '496' },
      { labProvider: 'QUEST', aliasName: 'HbA1c', aliasCode: '496' },
      { labProvider: 'LABCORP', aliasName: 'Hemoglobin A1c', aliasCode: '001453' },
      { labProvider: 'LABCORP', aliasName: 'HbA1c', aliasCode: '001453' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'HbA1c' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'A1c' },
    ],
  },
  {
    code: 'INSULIN_FASTING',
    name: 'Insulin, Fasting',
    category: 'Metabolic',
    subcategory: 'Blood Sugar',
    defaultUnit: 'uIU/mL',
    optimalRangeLow: 2,
    optimalRangeHigh: 6,
    refRangeLow: 2.6,
    refRangeHigh: 24.9,
    description: 'Fasting insulin. High levels indicate insulin resistance.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Insulin, Fasting', aliasCode: '561' },
      { labProvider: 'QUEST', aliasName: 'Insulin', aliasCode: '561' },
      { labProvider: 'LABCORP', aliasName: 'Insulin', aliasCode: '004333' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Fasting Insulin' },
    ],
  },
  {
    code: 'HOMA_IR',
    name: 'HOMA-IR',
    category: 'Metabolic',
    subcategory: 'Blood Sugar',
    defaultUnit: 'ratio',
    optimalRangeLow: 0.5,
    optimalRangeHigh: 1.0,
    refRangeLow: 0.5,
    refRangeHigh: 2.0,
    description: 'Insulin resistance index calculated from glucose and insulin.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'HOMA-IR', aliasCode: 'CALC' },
      { labProvider: 'LABCORP', aliasName: 'Insulin Resistance Score', aliasCode: 'CALC' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'HOMA-IR' },
    ],
  },

  // ===========================================
  // LIPID PANEL
  // ===========================================
  {
    code: 'TOTAL_CHOLESTEROL',
    name: 'Total Cholesterol',
    category: 'Lipid Panel',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 150,
    optimalRangeHigh: 200,
    refRangeLow: 100,
    refRangeHigh: 199,
    description: 'Total cholesterol in blood.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Cholesterol, Total', aliasCode: '228' },
      { labProvider: 'QUEST', aliasName: 'Total Cholesterol', aliasCode: '228' },
      { labProvider: 'LABCORP', aliasName: 'Cholesterol, Total', aliasCode: '001065' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Total Cholesterol' },
    ],
  },
  {
    code: 'LDL_CHOLESTEROL',
    name: 'LDL Cholesterol',
    category: 'Lipid Panel',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 50,
    optimalRangeHigh: 100,
    refRangeLow: 0,
    refRangeHigh: 99,
    description: 'Low-density lipoprotein. "Bad" cholesterol.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'LDL Cholesterol', aliasCode: '230' },
      { labProvider: 'QUEST', aliasName: 'LDL Chol Calc (NIH)', aliasCode: '230' },
      { labProvider: 'QUEST', aliasName: 'LDL-CHOLESTEROL', aliasCode: '230' },
      { labProvider: 'LABCORP', aliasName: 'LDL Chol Calc (NIH)', aliasCode: '001172' },
      { labProvider: 'LABCORP', aliasName: 'LDL Cholesterol Calc', aliasCode: '001172' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'LDL Cholesterol' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'LDL-C' },
    ],
  },
  {
    code: 'HDL_CHOLESTEROL',
    name: 'HDL Cholesterol',
    category: 'Lipid Panel',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 55,
    optimalRangeHigh: 100,
    refRangeLow: 39,
    refRangeHigh: 999,
    description: 'High-density lipoprotein. "Good" cholesterol.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'HDL Cholesterol', aliasCode: '229' },
      { labProvider: 'LABCORP', aliasName: 'HDL Cholesterol', aliasCode: '001107' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'HDL Cholesterol' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'HDL-C' },
    ],
  },
  {
    code: 'TRIGLYCERIDES',
    name: 'Triglycerides',
    category: 'Lipid Panel',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 40,
    optimalRangeHigh: 100,
    refRangeLow: 0,
    refRangeHigh: 149,
    description: 'Blood fats. Elevated by carbs and alcohol.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Triglycerides', aliasCode: '896' },
      { labProvider: 'LABCORP', aliasName: 'Triglycerides', aliasCode: '001172' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Triglycerides' },
    ],
  },
  {
    code: 'VLDL_CHOLESTEROL',
    name: 'VLDL Cholesterol',
    category: 'Lipid Panel',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 5,
    optimalRangeHigh: 20,
    refRangeLow: 5,
    refRangeHigh: 40,
    description: 'Very low-density lipoprotein.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'VLDL Cholesterol Cal', aliasCode: '906' },
      { labProvider: 'QUEST', aliasName: 'CHOLESTEROL, VERY LOW DENSITY LIPOPROTEIN', aliasCode: '906' },
      { labProvider: 'LABCORP', aliasName: 'VLDL Cholesterol Cal', aliasCode: '001172' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'VLDL Cholesterol' },
    ],
  },
  {
    code: 'LIPOPROTEIN_A',
    name: 'Lipoprotein(a)',
    category: 'Lipid Panel',
    defaultUnit: 'nmol/L',
    optimalRangeLow: 0,
    optimalRangeHigh: 75,
    refRangeLow: 0,
    refRangeHigh: 75,
    description: 'Genetic CVD risk marker. Cannot be modified by lifestyle.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Lipoprotein (a)', aliasCode: '34604' },
      { labProvider: 'QUEST', aliasName: 'Lp(a)', aliasCode: '34604' },
      { labProvider: 'LABCORP', aliasName: 'Lipoprotein (a)', aliasCode: '120188' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Lp(a)' },
    ],
  },
  {
    code: 'APOB',
    name: 'Apolipoprotein B',
    category: 'Lipid Panel',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 40,
    optimalRangeHigh: 80,
    refRangeLow: 52,
    refRangeHigh: 109,
    description: 'Better CVD predictor than LDL. One per atherogenic particle.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Apolipoprotein B', aliasCode: '91132' },
      { labProvider: 'QUEST', aliasName: 'Apo B', aliasCode: '91132' },
      { labProvider: 'LABCORP', aliasName: 'Apolipoprotein B', aliasCode: '120305' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'ApoB' },
    ],
  },

  // ===========================================
  // COMPLETE BLOOD COUNT (CBC)
  // ===========================================
  {
    code: 'WBC',
    name: 'White Blood Cell Count',
    category: 'CBC',
    defaultUnit: 'x10E3/uL',
    optimalRangeLow: 4.5,
    optimalRangeHigh: 8.0,
    refRangeLow: 3.4,
    refRangeHigh: 10.8,
    description: 'Immune cell count. Elevated in infection.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'WBC', aliasCode: '6399' },
      { labProvider: 'QUEST', aliasName: 'White Blood Cell Count', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'WBC', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'WBC' },
    ],
  },
  {
    code: 'RBC',
    name: 'Red Blood Cell Count',
    category: 'CBC',
    defaultUnit: 'x10E6/uL',
    optimalRangeLow: 4.5,
    optimalRangeHigh: 5.5,
    refRangeLow: 4.14,
    refRangeHigh: 5.80,
    description: 'Red cell count. May increase with TRT.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'RBC', aliasCode: '6399' },
      { labProvider: 'QUEST', aliasName: 'Red Blood Cell Count', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'RBC', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'RBC' },
    ],
  },
  {
    code: 'HEMOGLOBIN',
    name: 'Hemoglobin',
    category: 'CBC',
    defaultUnit: 'g/dL',
    optimalRangeLow: 14.0,
    optimalRangeHigh: 17.0,
    refRangeLow: 12.6,
    refRangeHigh: 17.7,
    description: 'Oxygen-carrying protein. Key TRT safety marker.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Hemoglobin', aliasCode: '6399' },
      { labProvider: 'QUEST', aliasName: 'Hgb', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'Hemoglobin', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Hemoglobin' },
    ],
  },
  {
    code: 'HEMATOCRIT',
    name: 'Hematocrit',
    category: 'CBC',
    defaultUnit: '%',
    optimalRangeLow: 40,
    optimalRangeHigh: 50,
    refRangeLow: 37.5,
    refRangeHigh: 51.0,
    description: 'Red cell volume percentage. Critical TRT safety marker.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Hematocrit', aliasCode: '6399' },
      { labProvider: 'QUEST', aliasName: 'Hct', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'Hematocrit', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Hematocrit' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'HCT' },
    ],
  },
  {
    code: 'MCV',
    name: 'Mean Corpuscular Volume',
    category: 'CBC',
    defaultUnit: 'fL',
    optimalRangeLow: 82,
    optimalRangeHigh: 95,
    refRangeLow: 79,
    refRangeHigh: 97,
    description: 'Average red cell size. Low in iron deficiency.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'MCV', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'MCV', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'MCV' },
    ],
  },
  {
    code: 'MCH',
    name: 'Mean Corpuscular Hemoglobin',
    category: 'CBC',
    defaultUnit: 'pg',
    optimalRangeLow: 27,
    optimalRangeHigh: 33,
    refRangeLow: 26.6,
    refRangeHigh: 33.0,
    description: 'Average hemoglobin per red cell.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'MCH', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'MCH', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'MCH' },
    ],
  },
  {
    code: 'MCHC',
    name: 'Mean Corpuscular Hemoglobin Concentration',
    category: 'CBC',
    defaultUnit: 'g/dL',
    optimalRangeLow: 32,
    optimalRangeHigh: 36,
    refRangeLow: 31.5,
    refRangeHigh: 35.7,
    description: 'Hemoglobin concentration in red cells.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'MCHC', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'MCHC', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'MCHC' },
    ],
  },
  {
    code: 'RDW',
    name: 'Red Cell Distribution Width',
    category: 'CBC',
    defaultUnit: '%',
    optimalRangeLow: 11.5,
    optimalRangeHigh: 14.0,
    refRangeLow: 11.6,
    refRangeHigh: 15.4,
    description: 'Variation in red cell size. High in mixed anemias.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'RDW', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'RDW', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'RDW' },
    ],
  },
  {
    code: 'PLATELETS',
    name: 'Platelet Count',
    category: 'CBC',
    defaultUnit: 'x10E3/uL',
    optimalRangeLow: 150,
    optimalRangeHigh: 350,
    refRangeLow: 150,
    refRangeHigh: 379,
    description: 'Blood clotting cells.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Platelet Count', aliasCode: '6399' },
      { labProvider: 'QUEST', aliasName: 'Platelets', aliasCode: '6399' },
      { labProvider: 'LABCORP', aliasName: 'Platelet Count', aliasCode: '005025' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Platelets' },
    ],
  },

  // ===========================================
  // LIVER FUNCTION
  // ===========================================
  {
    code: 'AST',
    name: 'Aspartate Aminotransferase',
    category: 'Liver Function',
    defaultUnit: 'U/L',
    optimalRangeLow: 10,
    optimalRangeHigh: 30,
    refRangeLow: 0,
    refRangeHigh: 40,
    description: 'Liver enzyme. Also elevated with muscle damage.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'AST (SGOT)', aliasCode: '265' },
      { labProvider: 'QUEST', aliasName: 'AST', aliasCode: '265' },
      { labProvider: 'LABCORP', aliasName: 'AST (SGOT)', aliasCode: '001123' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'AST' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'SGOT' },
    ],
  },
  {
    code: 'ALT',
    name: 'Alanine Aminotransferase',
    category: 'Liver Function',
    defaultUnit: 'U/L',
    optimalRangeLow: 10,
    optimalRangeHigh: 30,
    refRangeLow: 0,
    refRangeHigh: 44,
    description: 'More specific liver enzyme than AST.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'ALT (SGPT)', aliasCode: '265' },
      { labProvider: 'QUEST', aliasName: 'ALT', aliasCode: '265' },
      { labProvider: 'LABCORP', aliasName: 'ALT (SGPT)', aliasCode: '001057' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'ALT' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'SGPT' },
    ],
  },
  {
    code: 'ALP',
    name: 'Alkaline Phosphatase',
    category: 'Liver Function',
    defaultUnit: 'U/L',
    optimalRangeLow: 40,
    optimalRangeHigh: 100,
    refRangeLow: 39,
    refRangeHigh: 117,
    description: 'Elevated in liver or bone disease.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Alkaline Phosphatase', aliasCode: '201' },
      { labProvider: 'QUEST', aliasName: 'Alk Phos', aliasCode: '201' },
      { labProvider: 'LABCORP', aliasName: 'Alkaline Phosphatase', aliasCode: '001107' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'ALP' },
    ],
  },
  {
    code: 'GGT',
    name: 'Gamma-Glutamyl Transferase',
    category: 'Liver Function',
    defaultUnit: 'U/L',
    optimalRangeLow: 10,
    optimalRangeHigh: 35,
    refRangeLow: 0,
    refRangeHigh: 65,
    description: 'Sensitive marker for liver stress, especially alcohol.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'GGT', aliasCode: '480' },
      { labProvider: 'QUEST', aliasName: 'Gamma GT', aliasCode: '480' },
      { labProvider: 'LABCORP', aliasName: 'GGT', aliasCode: '001172' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'GGT' },
    ],
  },
  {
    code: 'BILIRUBIN_TOTAL',
    name: 'Bilirubin, Total',
    category: 'Liver Function',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 0.2,
    optimalRangeHigh: 1.0,
    refRangeLow: 0.0,
    refRangeHigh: 1.2,
    description: 'Breakdown product of red blood cells.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Bilirubin, Total', aliasCode: '214' },
      { labProvider: 'LABCORP', aliasName: 'Bilirubin, Total', aliasCode: '001099' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Total Bilirubin' },
    ],
  },
  {
    code: 'ALBUMIN',
    name: 'Albumin',
    category: 'Liver Function',
    defaultUnit: 'g/dL',
    optimalRangeLow: 4.2,
    optimalRangeHigh: 5.0,
    refRangeLow: 3.5,
    refRangeHigh: 5.5,
    description: 'Major blood protein made by liver.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Albumin', aliasCode: '206' },
      { labProvider: 'LABCORP', aliasName: 'Albumin, Serum', aliasCode: '001081' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Albumin' },
    ],
  },
  {
    code: 'TOTAL_PROTEIN',
    name: 'Total Protein',
    category: 'Liver Function',
    defaultUnit: 'g/dL',
    optimalRangeLow: 6.5,
    optimalRangeHigh: 7.5,
    refRangeLow: 6.0,
    refRangeHigh: 8.5,
    description: 'Total protein in blood.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Protein, Total', aliasCode: '829' },
      { labProvider: 'LABCORP', aliasName: 'Protein, Total, Serum', aliasCode: '001040' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Total Protein' },
    ],
  },

  // ===========================================
  // KIDNEY FUNCTION
  // ===========================================
  {
    code: 'CREATININE',
    name: 'Creatinine',
    category: 'Kidney Function',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 0.8,
    optimalRangeHigh: 1.2,
    refRangeLow: 0.76,
    refRangeHigh: 1.27,
    description: 'Waste product from muscle. Marker of kidney function.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Creatinine', aliasCode: '375' },
      { labProvider: 'LABCORP', aliasName: 'Creatinine', aliasCode: '001370' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Creatinine' },
    ],
  },
  {
    code: 'BUN',
    name: 'Blood Urea Nitrogen',
    category: 'Kidney Function',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 10,
    optimalRangeHigh: 20,
    refRangeLow: 6,
    refRangeHigh: 20,
    description: 'Waste product from protein. Marker of kidney function.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'BUN', aliasCode: '220' },
      { labProvider: 'QUEST', aliasName: 'Urea Nitrogen', aliasCode: '220' },
      { labProvider: 'LABCORP', aliasName: 'BUN', aliasCode: '001024' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'BUN' },
    ],
  },
  {
    code: 'EGFR',
    name: 'Estimated GFR',
    category: 'Kidney Function',
    defaultUnit: 'mL/min/1.73',
    optimalRangeLow: 90,
    optimalRangeHigh: 120,
    refRangeLow: 59,
    refRangeHigh: 999,
    description: 'Estimated kidney filtration rate. Primary kidney marker.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'eGFR', aliasCode: '375' },
      { labProvider: 'QUEST', aliasName: 'GFR (estimated)', aliasCode: '375' },
      { labProvider: 'LABCORP', aliasName: 'eGFR', aliasCode: '001370' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'eGFR' },
    ],
  },
  {
    code: 'BUN_CREATININE_RATIO',
    name: 'BUN/Creatinine Ratio',
    category: 'Kidney Function',
    defaultUnit: 'ratio',
    optimalRangeLow: 10,
    optimalRangeHigh: 20,
    refRangeLow: 8,
    refRangeHigh: 27,
    description: 'Ratio helping differentiate kidney vs. pre-renal issues.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'BUN/Creatinine Ratio', aliasCode: 'CALC' },
      { labProvider: 'LABCORP', aliasName: 'BUN/Creatinine Ratio', aliasCode: 'CALC' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'BUN/Creatinine Ratio' },
    ],
  },
  {
    code: 'URIC_ACID',
    name: 'Uric Acid',
    category: 'Kidney Function',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 4.0,
    optimalRangeHigh: 6.0,
    refRangeLow: 3.7,
    refRangeHigh: 8.6,
    description: 'Byproduct of purine metabolism. High levels cause gout.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Uric Acid', aliasCode: '905' },
      { labProvider: 'LABCORP', aliasName: 'Uric Acid, Serum', aliasCode: '001057' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Uric Acid' },
    ],
  },

  // ===========================================
  // ELECTROLYTES
  // ===========================================
  {
    code: 'SODIUM',
    name: 'Sodium',
    category: 'Electrolytes',
    defaultUnit: 'mEq/L',
    optimalRangeLow: 138,
    optimalRangeHigh: 145,
    refRangeLow: 134,
    refRangeHigh: 144,
    description: 'Major electrolyte. Affects fluid balance.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Sodium', aliasCode: '824' },
      { labProvider: 'LABCORP', aliasName: 'Sodium', aliasCode: '001016' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Sodium' },
    ],
  },
  {
    code: 'POTASSIUM',
    name: 'Potassium',
    category: 'Electrolytes',
    defaultUnit: 'mEq/L',
    optimalRangeLow: 4.0,
    optimalRangeHigh: 5.0,
    refRangeLow: 3.5,
    refRangeHigh: 5.2,
    description: 'Critical for heart and muscle function.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Potassium', aliasCode: '733' },
      { labProvider: 'LABCORP', aliasName: 'Potassium', aliasCode: '001008' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Potassium' },
    ],
  },
  {
    code: 'CHLORIDE',
    name: 'Chloride',
    category: 'Electrolytes',
    defaultUnit: 'mEq/L',
    optimalRangeLow: 98,
    optimalRangeHigh: 106,
    refRangeLow: 96,
    refRangeHigh: 106,
    description: 'Electrolyte affecting fluid balance.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Chloride', aliasCode: '229' },
      { labProvider: 'LABCORP', aliasName: 'Chloride', aliasCode: '001057' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Chloride' },
    ],
  },
  {
    code: 'CARBON_DIOXIDE',
    name: 'Carbon Dioxide',
    category: 'Electrolytes',
    defaultUnit: 'mEq/L',
    optimalRangeLow: 23,
    optimalRangeHigh: 28,
    refRangeLow: 19,
    refRangeHigh: 28,
    description: 'Reflects acid-base balance.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Carbon Dioxide, Total', aliasCode: '232' },
      { labProvider: 'QUEST', aliasName: 'CO2', aliasCode: '232' },
      { labProvider: 'LABCORP', aliasName: 'Carbon Dioxide, Total', aliasCode: '001057' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'CO2' },
    ],
  },
  {
    code: 'CALCIUM',
    name: 'Calcium',
    category: 'Electrolytes',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 9.2,
    optimalRangeHigh: 10.2,
    refRangeLow: 8.7,
    refRangeHigh: 10.2,
    description: 'Critical for bone, nerve, and muscle function.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Calcium', aliasCode: '225' },
      { labProvider: 'LABCORP', aliasName: 'Calcium, Serum', aliasCode: '001057' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Calcium' },
    ],
  },
  {
    code: 'MAGNESIUM',
    name: 'Magnesium',
    category: 'Electrolytes',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 2.0,
    optimalRangeHigh: 2.4,
    refRangeLow: 1.6,
    refRangeHigh: 2.3,
    description: 'Essential mineral. Often deficient in modern diet.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Magnesium', aliasCode: '622' },
      { labProvider: 'LABCORP', aliasName: 'Magnesium, Serum', aliasCode: '001537' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Magnesium' },
    ],
  },
  {
    code: 'PHOSPHORUS',
    name: 'Phosphorus',
    category: 'Electrolytes',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 3.0,
    optimalRangeHigh: 4.5,
    refRangeLow: 2.5,
    refRangeHigh: 4.5,
    description: 'Essential for bone and energy metabolism.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Phosphorus', aliasCode: '718' },
      { labProvider: 'LABCORP', aliasName: 'Phosphorus, Serum', aliasCode: '001198' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Phosphorus' },
    ],
  },

  // ===========================================
  // IRON PANEL
  // ===========================================
  {
    code: 'IRON',
    name: 'Iron, Serum',
    category: 'Iron Panel',
    defaultUnit: 'ug/dL',
    optimalRangeLow: 70,
    optimalRangeHigh: 150,
    refRangeLow: 38,
    refRangeHigh: 169,
    description: 'Serum iron level. Varies throughout the day.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Iron', aliasCode: '571' },
      { labProvider: 'LABCORP', aliasName: 'Iron, Serum', aliasCode: '001321' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Iron' },
    ],
  },
  {
    code: 'FERRITIN',
    name: 'Ferritin',
    category: 'Iron Panel',
    defaultUnit: 'ng/mL',
    optimalRangeLow: 70,
    optimalRangeHigh: 200,
    refRangeLow: 30,
    refRangeHigh: 400,
    genderSpecificRanges: {
      MALE: { refLow: 30, refHigh: 400, optimalLow: 70, optimalHigh: 200 },
      FEMALE: { refLow: 15, refHigh: 150, optimalLow: 50, optimalHigh: 100 },
    },
    description: 'Iron storage protein. Best marker of iron status.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Ferritin', aliasCode: '457' },
      { labProvider: 'LABCORP', aliasName: 'Ferritin, Serum', aliasCode: '004598' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Ferritin' },
    ],
  },
  {
    code: 'TIBC',
    name: 'Total Iron Binding Capacity',
    category: 'Iron Panel',
    defaultUnit: 'ug/dL',
    optimalRangeLow: 250,
    optimalRangeHigh: 350,
    refRangeLow: 250,
    refRangeHigh: 370,
    description: 'Capacity of blood to bind iron. High in iron deficiency.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'TIBC', aliasCode: '7573' },
      { labProvider: 'QUEST', aliasName: 'Iron Binding Capacity', aliasCode: '7573' },
      { labProvider: 'QUEST', aliasName: 'IRON BINDING CAPACITY', aliasCode: '7573' },
      { labProvider: 'LABCORP', aliasName: 'Iron Bind Cap (TIBC)', aliasCode: '001339' },
      { labProvider: 'LABCORP', aliasName: 'Iron Bind.Cap.(TIBC)', aliasCode: '001339' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'TIBC' },
    ],
  },
  {
    code: 'TRANSFERRIN_SAT',
    name: 'Transferrin Saturation',
    category: 'Iron Panel',
    defaultUnit: '%',
    optimalRangeLow: 25,
    optimalRangeHigh: 45,
    refRangeLow: 15,
    refRangeHigh: 55,
    description: 'Percentage of iron-binding sites occupied.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Transferrin Saturation', aliasCode: '7573' },
      { labProvider: 'QUEST', aliasName: 'Iron Saturation', aliasCode: '7573' },
      { labProvider: 'QUEST', aliasName: '% SATURATION', aliasCode: '7573' },
      { labProvider: 'LABCORP', aliasName: '% Saturation', aliasCode: '001339' },
      { labProvider: 'LABCORP', aliasName: 'Iron Saturation', aliasCode: '001339' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Transferrin Saturation' },
    ],
  },

  // ===========================================
  // VITAMINS
  // ===========================================
  {
    code: 'VITAMIN_D_25_OH',
    name: 'Vitamin D, 25-Hydroxy',
    category: 'Vitamins',
    defaultUnit: 'ng/mL',
    optimalRangeLow: 50,
    optimalRangeHigh: 80,
    refRangeLow: 30,
    refRangeHigh: 100,
    description: 'Best marker of vitamin D status. Often low.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Vitamin D, 25-Hydroxy', aliasCode: '17306' },
      { labProvider: 'QUEST', aliasName: '25-Hydroxyvitamin D', aliasCode: '17306' },
      { labProvider: 'QUEST', aliasName: 'VITAMIN D,25-OH,TOTAL,IA', aliasCode: '17306' },
      { labProvider: 'LABCORP', aliasName: 'Vitamin D, 25-Hydroxy', aliasCode: '081950' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Vitamin D' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: '25-OH Vitamin D' },
    ],
  },
  {
    code: 'VITAMIN_B12',
    name: 'Vitamin B12',
    category: 'Vitamins',
    defaultUnit: 'pg/mL',
    optimalRangeLow: 500,
    optimalRangeHigh: 1000,
    refRangeLow: 211,
    refRangeHigh: 946,
    description: 'Essential for nerve function and DNA synthesis.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Vitamin B12', aliasCode: '927' },
      { labProvider: 'LABCORP', aliasName: 'Vitamin B12', aliasCode: '001503' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'B12' },
    ],
  },
  {
    code: 'FOLATE',
    name: 'Folate',
    category: 'Vitamins',
    defaultUnit: 'ng/mL',
    optimalRangeLow: 10,
    optimalRangeHigh: 20,
    refRangeLow: 2.7,
    refRangeHigh: 17.0,
    description: 'B vitamin essential for DNA synthesis.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Folate', aliasCode: '466' },
      { labProvider: 'QUEST', aliasName: 'Folic Acid', aliasCode: '466' },
      { labProvider: 'LABCORP', aliasName: 'Folate, Serum', aliasCode: '001644' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Folate' },
    ],
  },

  // ===========================================
  // INFLAMMATION MARKERS
  // ===========================================
  {
    code: 'CRP_HS',
    name: 'C-Reactive Protein, High Sensitivity',
    category: 'Inflammation',
    defaultUnit: 'mg/L',
    optimalRangeLow: 0,
    optimalRangeHigh: 1.0,
    refRangeLow: 0,
    refRangeHigh: 3.0,
    description: 'Cardiovascular inflammation marker.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'C-Reactive Protein, Cardiac', aliasCode: '10124' },
      { labProvider: 'QUEST', aliasName: 'hs-CRP', aliasCode: '10124' },
      { labProvider: 'QUEST', aliasName: 'HS CRP', aliasCode: '10124' },
      { labProvider: 'LABCORP', aliasName: 'C-Reactive Protein, Cardiac', aliasCode: '120766' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'hs-CRP' },
    ],
  },
  {
    code: 'ESR',
    name: 'Erythrocyte Sedimentation Rate',
    category: 'Inflammation',
    defaultUnit: 'mm/hr',
    optimalRangeLow: 0,
    optimalRangeHigh: 10,
    refRangeLow: 0,
    refRangeHigh: 15,
    description: 'General inflammation marker.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'ESR', aliasCode: '809' },
      { labProvider: 'QUEST', aliasName: 'Sed Rate', aliasCode: '809' },
      { labProvider: 'LABCORP', aliasName: 'Sedimentation Rate-Westergren', aliasCode: '005215' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'ESR' },
    ],
  },
  {
    code: 'HOMOCYSTEINE',
    name: 'Homocysteine',
    category: 'Inflammation',
    defaultUnit: 'umol/L',
    optimalRangeLow: 5,
    optimalRangeHigh: 9,
    refRangeLow: 0,
    refRangeHigh: 10.4,
    description: 'CVD risk marker. High with B vitamin deficiency.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Homocysteine', aliasCode: '31789' },
      { labProvider: 'LABCORP', aliasName: 'Homocyst(e)ine', aliasCode: '706994' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Homocysteine' },
    ],
  },
  {
    code: 'FIBRINOGEN',
    name: 'Fibrinogen',
    category: 'Inflammation',
    defaultUnit: 'mg/dL',
    optimalRangeLow: 200,
    optimalRangeHigh: 350,
    refRangeLow: 193,
    refRangeHigh: 507,
    description: 'Clotting factor and inflammation marker.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Fibrinogen Activity', aliasCode: '461' },
      { labProvider: 'LABCORP', aliasName: 'Fibrinogen Activity', aliasCode: '001610' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Fibrinogen' },
    ],
  },

  // ===========================================
  // PROSTATE
  // ===========================================
  {
    code: 'PSA_TOTAL',
    name: 'PSA, Total',
    category: 'Prostate',
    defaultUnit: 'ng/mL',
    optimalRangeLow: 0,
    optimalRangeHigh: 2.5,
    refRangeLow: 0,
    refRangeHigh: 4.0,
    description: 'Prostate-specific antigen. Critical TRT monitoring marker.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'PSA, Total', aliasCode: '5363' },
      { labProvider: 'QUEST', aliasName: 'Prostate Specific Ag', aliasCode: '5363' },
      { labProvider: 'LABCORP', aliasName: 'Prostate-Specific Ag, Serum', aliasCode: '010322' },
      { labProvider: 'LABCORP', aliasName: 'PSA', aliasCode: '010322' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'PSA' },
    ],
  },
  {
    code: 'PSA_FREE',
    name: 'PSA, Free',
    category: 'Prostate',
    defaultUnit: '%',
    optimalRangeLow: 25,
    optimalRangeHigh: 100,
    refRangeLow: 25,
    refRangeHigh: 100,
    description: 'Percentage of free PSA. Higher is better.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'PSA, Free', aliasCode: '11365' },
      { labProvider: 'LABCORP', aliasName: 'Prostate Specific Ag, Free', aliasCode: '480780' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Free PSA' },
    ],
  },

  // ===========================================
  // CORTISOL / ADRENAL
  // ===========================================
  {
    code: 'CORTISOL_AM',
    name: 'Cortisol, AM',
    category: 'Adrenal',
    defaultUnit: 'ug/dL',
    optimalRangeLow: 10,
    optimalRangeHigh: 18,
    refRangeLow: 6.2,
    refRangeHigh: 19.4,
    description: 'Morning cortisol. Reflects adrenal function.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Cortisol', aliasCode: '367' },
      { labProvider: 'QUEST', aliasName: 'Cortisol, AM', aliasCode: '367' },
      { labProvider: 'LABCORP', aliasName: 'Cortisol', aliasCode: '004051' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Cortisol' },
    ],
  },

  // ===========================================
  // GROWTH HORMONE
  // ===========================================
  {
    code: 'IGF1',
    name: 'IGF-1',
    category: 'Growth Hormone',
    defaultUnit: 'ng/mL',
    optimalRangeLow: 150,
    optimalRangeHigh: 250,
    refRangeLow: 98,
    refRangeHigh: 282,
    description: 'Insulin-like growth factor. Marker of GH activity.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'IGF-1', aliasCode: '560' },
      { labProvider: 'QUEST', aliasName: 'IGF 1, LC/MS', aliasCode: '560' },
      { labProvider: 'QUEST', aliasName: 'Insulin-Like Growth Factor I', aliasCode: '560' },
      { labProvider: 'LABCORP', aliasName: 'Insulin-Like Growth Factor I', aliasCode: '010363' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'IGF-1' },
    ],
  },

  // ===========================================
  // ADDITIONAL MARKERS
  // ===========================================
  {
    code: 'UIBC',
    name: 'Unsaturated Iron Binding Capacity',
    category: 'Iron Panel',
    defaultUnit: 'ug/dL',
    optimalRangeLow: 150,
    optimalRangeHigh: 300,
    refRangeLow: 111,
    refRangeHigh: 343,
    description: 'Unoccupied portion of transferrin. High when iron-deficient.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'UIBC', aliasCode: '7573' },
      { labProvider: 'QUEST', aliasName: 'Unsaturated Iron Binding Capacity', aliasCode: '7573' },
      { labProvider: 'LABCORP', aliasName: 'UIBC', aliasCode: '001339' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'UIBC' },
    ],
  },
  {
    code: 'CREATINE_KINASE',
    name: 'Creatine Kinase',
    category: 'Muscle Markers',
    defaultUnit: 'U/L',
    optimalRangeLow: 30,
    optimalRangeHigh: 200,
    refRangeLow: 30,
    refRangeHigh: 200,
    genderSpecificRanges: {
      MALE: { refLow: 39, refHigh: 308, optimalLow: 50, optimalHigh: 200 },
      FEMALE: { refLow: 26, refHigh: 192, optimalLow: 30, optimalHigh: 150 },
    },
    description: 'Enzyme released from damaged muscle tissue.',
    aliases: [
      { labProvider: 'QUEST', aliasName: 'Creatine Kinase, Total', aliasCode: '320' },
      { labProvider: 'QUEST', aliasName: 'CK Total', aliasCode: '320' },
      { labProvider: 'LABCORP', aliasName: 'Creatine Kinase,Total', aliasCode: '001370' },
      { labProvider: 'LABCORP', aliasName: 'CK, Total', aliasCode: '001370' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'Creatine Kinase' },
      { labProvider: 'ACCESS_MEDICAL', aliasName: 'CK' },
    ],
  },
];

async function main() {
  console.log('Starting biomarker seed...');

  let created = 0;
  let aliasesCreated = 0;

  for (const biomarker of biomarkers) {
    // Create the biomarker catalog entry
    const catalogEntry = await prisma.biomarkerCatalog.upsert({
      where: { code: biomarker.code },
      update: {
        name: biomarker.name,
        category: biomarker.category,
        subcategory: biomarker.subcategory,
        defaultUnit: biomarker.defaultUnit,
        optimalRangeLow: biomarker.optimalRangeLow,
        optimalRangeHigh: biomarker.optimalRangeHigh,
        refRangeLow: biomarker.refRangeLow,
        refRangeHigh: biomarker.refRangeHigh,
        genderSpecificRanges: biomarker.genderSpecificRanges
          ? JSON.stringify(biomarker.genderSpecificRanges)
          : null,
        description: biomarker.description,
      },
      create: {
        code: biomarker.code,
        name: biomarker.name,
        category: biomarker.category,
        subcategory: biomarker.subcategory,
        defaultUnit: biomarker.defaultUnit,
        optimalRangeLow: biomarker.optimalRangeLow,
        optimalRangeHigh: biomarker.optimalRangeHigh,
        refRangeLow: biomarker.refRangeLow,
        refRangeHigh: biomarker.refRangeHigh,
        genderSpecificRanges: biomarker.genderSpecificRanges
          ? JSON.stringify(biomarker.genderSpecificRanges)
          : null,
        description: biomarker.description,
        displayOrder: created,
      },
    });

    created++;

    // Create aliases for each lab provider
    for (const alias of biomarker.aliases) {
      await prisma.biomarkerAlias.upsert({
        where: {
          biomarkerId_labProvider_aliasName: {
            biomarkerId: catalogEntry.id,
            labProvider: alias.labProvider,
            aliasName: alias.aliasName,
          },
        },
        update: {
          aliasCode: alias.aliasCode,
          labUnit: alias.labUnit,
          conversionFactor: alias.conversionFactor || 1.0,
          labRefRangeLow: alias.labRefRangeLow,
          labRefRangeHigh: alias.labRefRangeHigh,
        },
        create: {
          biomarkerId: catalogEntry.id,
          labProvider: alias.labProvider,
          aliasName: alias.aliasName,
          aliasCode: alias.aliasCode,
          labUnit: alias.labUnit,
          conversionFactor: alias.conversionFactor || 1.0,
          labRefRangeLow: alias.labRefRangeLow,
          labRefRangeHigh: alias.labRefRangeHigh,
        },
      });
      aliasesCreated++;
    }
  }

  console.log(`\nSeed complete!`);
  console.log(`  Biomarkers: ${created}`);
  console.log(`  Aliases: ${aliasesCreated}`);

  // Summary by category
  const categories = await prisma.biomarkerCatalog.groupBy({
    by: ['category'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  console.log(`\nBiomarkers by category:`);
  for (const cat of categories) {
    console.log(`  ${cat.category}: ${cat._count.id}`);
  }

  // Summary by lab provider
  const providers = await prisma.biomarkerAlias.groupBy({
    by: ['labProvider'],
    _count: { id: true },
  });

  console.log(`\nAliases by lab provider:`);
  for (const prov of providers) {
    console.log(`  ${prov.labProvider}: ${prov._count.id}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
