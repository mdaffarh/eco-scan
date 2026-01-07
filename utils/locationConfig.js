export const FAKULTAS_OPTIONS = [
  { value: 'FIP', label: 'FIP - Fakultas Ilmu Pendidikan' },
  { value: 'FK', label: 'FK - Fakultas Kedokteran' },
  { value: 'FPSD', label: 'FPSD - Fakultas Pendidikan Seni dan Desain' },
  { value: 'FPBS', label: 'FPBS - Fakultas Pendidikan Bahasa dan Sastra' },
  { value: 'FPIPS', label: 'FPIPS - Fakultas Pendidikan Ilmu Pengetahuan Sosial' },
  { value: 'FPOK', label: 'FPOK - Fakultas Pendidikan Olahraga dan Kesehatan' },
  { value: 'FPTI', label: 'FPTI - Fakultas Pendidikan Teknologi dan Industri' },
  { value: 'FPMIPA', label: 'FPMIPA - Fakultas Pendidikan Matematika dan Ilmu Pengetahuan Alam' },
  { value: 'FPEB', label: 'FPEB - Fakultas Pendidikan Ekonomi dan Bisnis' }
];

export const LOKASI_DATA = {
  FIP: [
    {
      value: 'FIP_BESAR',
      label: 'FIP Besar',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Area utama FIP'
    },
    {
      value: 'FIP_LT9',
      label: 'Lantai 9',
      bins: ['Organik', 'Anorganik', 'Kertas'],
      description: 'Lantai 9 gedung FIP'
    }
  ],
  FK: [
    {
      value: 'FK_DEPAN',
      label: 'Depan FK',
      bins: ['Organik', 'Anorganik', 'Kertas', 'Residu'],
      description: 'Area depan Fakultas Kedokteran'
    },
    {
      value: 'FK_LOBBY',
      label: 'Lobby FK',
      bins: ['Organik', 'Anorganik', 'Kertas', 'Residu'],
      description: 'Lobby utama FK'
    },
    {
      value: 'FK_LOBBY_TANGGA',
      label: 'Lobby dekat tangga',
      bins: ['B3', 'Organik', 'Anorganik', 'Residu'],
      description: 'Lobby area tangga'
    },
    {
      value: 'FK_LOBBY_WC',
      label: 'Lobby dekat WC',
      bins: ['Organik', 'Anorganik'],
      description: 'Lobby dekat toilet'
    },
    {
      value: 'FK_LT2',
      label: 'Lantai 2',
      bins: ['Organik', 'Anorganik'],
      description: 'Lantai 2 FK'
    }
  ],
  FPSD: [
    {
      value: 'FPSD_BASEMENT_KANAN',
      label: 'Pintu Kanan Basement FPSD Baru',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Basement gedung baru FPSD'
    },
    {
      value: 'FPSD_DEPAN',
      label: 'Depan FPSD',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Area depan FPSD'
    },
    {
      value: 'FPSD_LT4',
      label: 'Lantai 4',
      bins: ['Organik', 'Anorganik', 'Residu'],
      description: 'Lantai 4 FPSD'
    }
  ],
  FPBS: [
    {
      value: 'FPBS_DEPAN',
      label: 'Depan FPBS',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Area depan FPBS'
    },
    {
      value: 'FPBS_LOBBY',
      label: 'Lobby',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Lobby utama FPBS'
    },
    {
      value: 'FPBS_LT1',
      label: 'Lantai 1',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Lantai 1 FPBS'
    },
    {
      value: 'FPBS_LT2',
      label: 'Lantai 2',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Lantai 2 FPBS'
    },
    {
      value: 'FPBS_LT5',
      label: 'Lantai 5',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Lantai 5 FPBS'
    }
  ],
  FPIPS: [
    {
      value: 'FPIPS_LIFT',
      label: 'Dekat Lift',
      bins: ['Organik', 'Anorganik', 'Residu'],
      description: 'Area dekat lift FPIPS'
    },
    {
      value: 'FPIPS_MUSOLA_PRIA',
      label: 'Musola Pria',
      bins: ['B3', 'Organik', 'Anorganik', 'Residu'],
      description: 'Area musola pria'
    }
  ],
  FPOK: [
    {
      value: 'FPOK_B',
      label: 'FPOK B',
      bins: ['Organik', 'Anorganik'],
      description: 'Gedung B FPOK'
    }
  ],
  FPTI: [
    {
      value: 'FPTI_COE',
      label: 'Depan Gedung COE',
      bins: ['Organik', 'Anorganik (Non Kertas)', 'Kertas (Anorganik Kertas)', 'Botol Plastik (Anorganik Botol Plastik)'],
      description: 'Area depan COE'
    },
    {
      value: 'FPTI_GEDUNG_B',
      label: 'FPTI Gedung B',
      bins: ['Organik', 'Anorganik (Non Kertas)', 'Kertas (Anorganik Kertas)', 'Botol Plastik (Anorganik Botol Plastik)'],
      description: 'Gedung B FPTI'
    },
    {
      value: 'FPTI_WORKSHOP',
      label: 'Sebrang Workshop Konstruksi',
      bins: ['B3', 'Organik', 'Anorganik', 'Kertas (Anorganik Kertas)', 'Botol Plastik (Anorganik Botol Plastik)'],
      description: 'Area sebrang workshop'
    },
    {
      value: 'FPTI_GEDUNG_A',
      label: 'Gedung A',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Gedung A FPTI'
    },
    {
      value: 'FPTI_SAUNG',
      label: 'Saung deket Gedung A',
      bins: ['B3', 'Organik', 'Anorganik'],
      description: 'Area saung dekat gedung A'
    }
  ],
  FPMIPA: [
    {
      value: 'FPMIPA_JICA',
      label: 'Hampir diseluruh JICA',
      bins: ['Anorganik', 'Kertas', 'Residu', 'Botol Plastik'],
      description: 'Area umum gedung JICA'
    },
    {
      value: 'FPMIPA_LOBBY_JICA',
      label: 'Lobby JICA',
      bins: ['Botol Plastik'],
      description: 'Lobby gedung JICA'
    },
    {
      value: 'FPMIPA_B',
      label: 'Depan FPMIPA B',
      bins: ['Anorganik', 'Kertas', 'Residu', 'Botol Plastik'],
      description: 'Area depan gedung FPMIPA B'
    },
    {
      value: 'FPMIPA_JICA_TIMUR',
      label: 'Bagian Timur Gedung JICA',
      bins: ['Organik', 'Anorganik'],
      description: 'Sisi timur gedung JICA'
    }
  ],
  FPEB: [
    {
      value: 'FPEB_LAMA',
      label: 'Depan FPEB Lama',
      bins: ['Anorganik'],
      description: 'Area depan gedung lama FPEB'
    },
    {
      value: 'FPEB_BARU_LT1',
      label: 'Lt. 1 FPEB Baru',
      bins: ['Anorganik'],
      description: 'Lantai 1 gedung baru FPEB'
    }
  ]
};

/**
 * Get available bins for a specific location
 */
export function getAvailableBins(fakultas, lokasiValue) {
  const fakultasData = LOKASI_DATA[fakultas];
  if (!fakultasData) return [];
  
  const lokasi = fakultasData.find(loc => loc.value === lokasiValue);
  return lokasi ? lokasi.bins : [];
}

/**
 * Get disposal instruction based on waste type and location
 */
export function getDisposalByLocation(wasteType, fakultas, lokasiValue) {
  const availableBins = getAvailableBins(fakultas, lokasiValue);
  
  // Map waste type to bin category
  const binMapping = {
    'Organik': 'Organik',
    'Anorganik': 'Anorganik',
    'Non Organik Daur Ulang': 'Anorganik',
    'Botol Plastik': 'Botol Plastik',
    'Kertas': 'Kertas',
    'Residu': 'Residu',
    'B3': 'B3'
  };
  
  const targetBin = binMapping[wasteType];
  
  // Check if target bin is available at this location
  const hasBin = availableBins.some(bin => bin.includes(targetBin));
  
  if (hasBin) {
    return {
      available: true,
      message: `Buang ke tempat sampah ${targetBin} yang tersedia di lokasi ini.`,
      bins: availableBins
    };
  } else {
    return {
      available: false,
      message: `Tempat sampah ${targetBin} tidak tersedia di lokasi ini. Lokasi ini hanya memiliki: ${availableBins.join(', ')}. Silakan cari lokasi terdekat yang menyediakan tempat sampah ${targetBin}.`,
      bins: availableBins
    };
  }
}

/**
 * Get location display name
 */
export function getLocationDisplayName(fakultas, lokasiValue) {
  const fakultasData = LOKASI_DATA[fakultas];
  if (!fakultasData) return '';
  
  const lokasi = fakultasData.find(loc => loc.value === lokasiValue);
  const fakultasLabel = FAKULTAS_OPTIONS.find(f => f.value === fakultas)?.label || fakultas;
  
  return lokasi ? `${fakultasLabel} - ${lokasi.label}` : '';
}

/**
 * Map waste type to bin category for matching
 */
export function mapWasteTypeToBin(wasteType) {
  const binMapping = {
    'Organik': 'Organik',
    'Anorganik': 'Anorganik',
    'Non Organik Daur Ulang': 'Anorganik',
    'Botol Plastik': 'Botol Plastik',
    'Botol Plasti...': 'Botol Plastik',  // Handle truncated label
    'Kertas': 'Kertas',
    'Residu': 'Residu',
    'B3': 'B3'
  };
  
  // Handle partial matches for truncated labels
  const normalizedWaste = wasteType?.trim();
  if (normalizedWaste?.includes('Botol Plasti')) {
    return 'Botol Plastik';
  }
  
  return binMapping[normalizedWaste] || normalizedWaste;
}

/**
 * Get fallback bin type for waste types that can use alternative bins
 * Botol Plastik dan Kertas bisa masuk ke Anorganik jika tidak ada tempat khusus
 */
export function getFallbackBin(wasteType) {
  const fallbackMapping = {
    'Botol Plastik': 'Anorganik',
    'Botol Plasti...': 'Anorganik',  // Handle truncated label
    'Kertas': 'Anorganik'
  };
  
  // Handle partial matches
  const normalizedWaste = wasteType?.trim();
  if (normalizedWaste?.includes('Botol Plasti')) {
    return 'Anorganik';
  }
  
  return fallbackMapping[normalizedWaste] || null;
}

/**
 * Check if a bin matches the target bin type
 * Handles exact match and bins with additional labels like "Anorganik (Non Kertas)"
 */
export function binMatches(bin, targetBin) {
  if (!bin || !targetBin) return false;
  
  const binLower = bin.toLowerCase().trim();
  const targetLower = targetBin.toLowerCase().trim();
  
  // Exact match
  if (binLower === targetLower) return true;
  
  // Bin starts with targetBin (e.g., "Anorganik (Non Kertas)" matches "Anorganik")
  if (binLower.startsWith(targetLower + ' (')) return true;
  if (binLower.startsWith(targetLower + ' ')) return true;
  
  // For debugging
  // console.log('Matching:', { bin: binLower, target: targetLower, match: false });
  
  return false;
}

/**
 * Find all locations across all fakultas that have specific bin type
 * Returns object grouped by fakultas
 */
export function findLocationsWithBin(binType) {
  const result = {};
  
  Object.keys(LOKASI_DATA).forEach(fakultasKey => {
    const locations = LOKASI_DATA[fakultasKey].filter(lokasi => {
      return lokasi.bins.some(bin => binMatches(bin, binType));
    });
    
    if (locations.length > 0) {
      result[fakultasKey] = locations;
    }
  });
  
  return result;
}

/**
 * Find locations in specific fakultas that have specific bin type
 */
export function findLocationsInFakultasWithBin(fakultas, binType) {
  const fakultasData = LOKASI_DATA[fakultas];
  if (!fakultasData) return [];
  
  return fakultasData.filter(lokasi => {
    return lokasi.bins.some(bin => binMatches(bin, binType));
  });
}

/**
 * Find locations in fakultas with fallback option
 * Returns object with specific and fallback locations
 */
export function findLocationsWithFallback(fakultas, wasteType) {
  const primaryBin = mapWasteTypeToBin(wasteType);
  const fallbackBin = getFallbackBin(wasteType);
  
  const primaryLocations = findLocationsInFakultasWithBin(fakultas, primaryBin);
  const fallbackLocations = fallbackBin 
    ? findLocationsInFakultasWithBin(fakultas, fallbackBin)
    : [];
  
  return {
    hasPrimary: primaryLocations.length > 0,
    hasFallback: fallbackLocations.length > 0,
    primaryBin,
    fallbackBin,
    primaryLocations,
    fallbackLocations
  };
}
