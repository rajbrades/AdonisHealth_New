'use client';

import { useState } from 'react';

interface ExtractedBiomarker {
  name: string;
  value: string;
  unit: string | null;
  refRange: string | null;
  flag: string | null;
}

interface MatchedBiomarker {
  extracted: ExtractedBiomarker;
  catalogMatch: {
    id: string;
    code: string;
    name: string;
    category: string;
    defaultUnit: string;
    optimalRangeLow: number | null;
    optimalRangeHigh: number | null;
  } | null;
  matchedVia: string | null;
  confidence: 'exact' | 'fuzzy' | 'none';
  numericValue: number | null;
  calculatedFlag: string | null;
}

interface ProcessingResult {
  success: boolean;
  pdfText: string;
  textLength: number;
  extraction: {
    collectionDate: string | null;
    patientName: string | null;
    biomarkers: ExtractedBiomarker[];
  };
  matched: MatchedBiomarker[];
  stats: {
    total: number;
    matched: number;
    unmatched: number;
    matchRate: string;
  };
  unmatchedNames: string[];
}

interface AliasStats {
  total: number;
  biomarkerCount: number;
  byProvider: { provider: string; count: number }[];
}

export default function LabsTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [provider, setProvider] = useState('QUEST');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AliasStats | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'results' | 'unmatched'>('upload');

  // For adding new aliases
  const [newAliasCode, setNewAliasCode] = useState('');
  const [newAliasProvider, setNewAliasProvider] = useState('QUEST');
  const [newAliasName, setNewAliasName] = useState('');
  const [aliasMessage, setAliasMessage] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:3001/labs/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch stats', e);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('provider', provider);

    try {
      const res = await fetch('http://localhost:3001/labs/extract', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Extraction failed');
      }

      const data = await res.json();
      setResult(data);
      setActiveTab('results');
      fetchStats();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlias = async () => {
    if (!newAliasCode || !newAliasName) return;

    setAliasMessage(null);

    try {
      const res = await fetch('http://localhost:3001/labs/alias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biomarkerCode: newAliasCode,
          labProvider: newAliasProvider,
          aliasName: newAliasName,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add alias');
      }

      setAliasMessage(`Added alias "${newAliasName}" for ${newAliasCode}`);
      setNewAliasName('');
      fetchStats();
    } catch (e) {
      setAliasMessage(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const getFlagColor = (flag: string | null) => {
    switch (flag) {
      case 'OPTIMAL': return 'bg-green-100 text-green-800';
      case 'HIGH':
      case 'LOW': return 'bg-yellow-100 text-yellow-800';
      case 'CRITICAL_HIGH':
      case 'CRITICAL_LOW': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'exact': return 'text-green-600';
      case 'fuzzy': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Extraction Test</h1>
        <p className="text-gray-600 mb-8">Upload a lab PDF to test biomarker extraction and alias matching</p>

        {/* Stats Bar */}
        {stats && (
          <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center gap-8">
            <div>
              <span className="text-sm text-gray-500">Biomarkers</span>
              <p className="text-2xl font-semibold">{stats.biomarkerCount}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total Aliases</span>
              <p className="text-2xl font-semibold">{stats.total}</p>
            </div>
            {stats.byProvider.map((p) => (
              <div key={p.provider}>
                <span className="text-sm text-gray-500">{p.provider}</span>
                <p className="text-2xl font-semibold">{p.count}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm ${
              activeTab === 'upload'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Upload PDF
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            disabled={!result}
          >
            Results {result && `(${result.stats.total})`}
          </button>
          <button
            onClick={() => setActiveTab('unmatched')}
            className={`px-4 py-2 -mb-px border-b-2 font-medium text-sm ${
              activeTab === 'unmatched'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            disabled={!result || result.stats.unmatched === 0}
          >
            Unmatched {result && result.stats.unmatched > 0 && `(${result.stats.unmatched})`}
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lab Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="QUEST">Quest Diagnostics</option>
                  <option value="LABCORP">Labcorp</option>
                  <option value="ACCESS_MEDICAL">Access Medical Labs</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lab PDF
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    {file ? file.name : 'Click to select a PDF file'}
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Extract Biomarkers'}
              </button>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && result && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Extraction Summary</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">Total Extracted</p>
                  <p className="text-2xl font-semibold">{result.stats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <p className="text-sm text-green-600">Matched</p>
                  <p className="text-2xl font-semibold text-green-700">{result.stats.matched}</p>
                </div>
                <div className="bg-red-50 p-4 rounded">
                  <p className="text-sm text-red-600">Unmatched</p>
                  <p className="text-2xl font-semibold text-red-700">{result.stats.unmatched}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-sm text-blue-600">Match Rate</p>
                  <p className="text-2xl font-semibold text-blue-700">{result.stats.matchRate}</p>
                </div>
              </div>
              {result.extraction.patientName && (
                <p className="mt-4 text-sm text-gray-600">
                  Patient: {result.extraction.patientName}
                </p>
              )}
              {result.extraction.collectionDate && (
                <p className="text-sm text-gray-600">
                  Collection Date: {result.extraction.collectionDate}
                </p>
              )}
            </div>

            {/* Matched Results Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catalog Match</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flag</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.matched.map((m, i) => (
                    <tr key={i} className={m.catalogMatch ? '' : 'bg-red-50'}>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-900">{m.extracted.name}</div>
                        {m.matchedVia && (
                          <div className="text-xs text-gray-500">{m.matchedVia}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {m.extracted.value} {m.extracted.unit}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {m.catalogMatch ? (
                          <div>
                            <div className="font-medium">{m.catalogMatch.name}</div>
                            <div className="text-xs text-gray-500">{m.catalogMatch.code}</div>
                          </div>
                        ) : (
                          <span className="text-red-600">No match</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`font-medium ${getConfidenceColor(m.confidence)}`}>
                          {m.confidence}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {m.calculatedFlag && (
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getFlagColor(m.calculatedFlag)}`}>
                            {m.calculatedFlag}
                          </span>
                        )}
                        {m.extracted.flag && !m.calculatedFlag && (
                          <span className="text-gray-500 text-xs">Lab: {m.extracted.flag}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Unmatched Tab */}
        {activeTab === 'unmatched' && result && result.stats.unmatched > 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Add Missing Alias</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biomarker Code
                  </label>
                  <input
                    type="text"
                    value={newAliasCode}
                    onChange={(e) => setNewAliasCode(e.target.value.toUpperCase())}
                    placeholder="TOTAL_TESTOSTERONE"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider
                  </label>
                  <select
                    value={newAliasProvider}
                    onChange={(e) => setNewAliasProvider(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="QUEST">Quest</option>
                    <option value="LABCORP">Labcorp</option>
                    <option value="ACCESS_MEDICAL">Access Medical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alias Name
                  </label>
                  <input
                    type="text"
                    value={newAliasName}
                    onChange={(e) => setNewAliasName(e.target.value)}
                    placeholder="Testosterone, Total"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <button
                onClick={handleAddAlias}
                disabled={!newAliasCode || !newAliasName}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Add Alias
              </button>
              {aliasMessage && (
                <p className={`mt-2 text-sm ${aliasMessage.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {aliasMessage}
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Unmatched Biomarkers</h2>
              <ul className="space-y-2">
                {result.unmatchedNames.map((name, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-md"
                  >
                    <span className="font-mono text-sm">{name}</span>
                    <button
                      onClick={() => {
                        setNewAliasName(name);
                        setNewAliasProvider(provider);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Use as alias
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
