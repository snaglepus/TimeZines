// City → IANA timezone. Format: name|country|timezone|search aliases
window.TZ_CITIES = `
Sydney|Australia|Australia/Sydney|nsw
Melbourne|Australia|Australia/Melbourne|vic
Brisbane|Australia|Australia/Brisbane|qld
Gold Coast|Australia|Australia/Brisbane|
Canberra|Australia|Australia/Sydney|act
Hobart|Australia|Australia/Hobart|tasmania
Adelaide|Australia|Australia/Adelaide|sa
Darwin|Australia|Australia/Darwin|nt
Perth|Australia|Australia/Perth|wa
Lord Howe Island|Australia|Australia/Lord_Howe|
Auckland|New Zealand|Pacific/Auckland|nz
Wellington|New Zealand|Pacific/Auckland|nz
Christchurch|New Zealand|Pacific/Auckland|nz
Chatham Islands|New Zealand|Pacific/Chatham|
Suva|Fiji|Pacific/Fiji|
Nouméa|New Caledonia|Pacific/Noumea|
Port Moresby|Papua New Guinea|Pacific/Port_Moresby|png
Apia|Samoa|Pacific/Apia|
Nukuʻalofa|Tonga|Pacific/Tongatapu|nukualofa
Kiritimati|Kiribati|Pacific/Kiritimati|christmas island
Guam|Guam|Pacific/Guam|hagatna
Honolulu|United States|Pacific/Honolulu|hawaii hi usa
Tokyo|Japan|Asia/Tokyo|jp
Osaka|Japan|Asia/Tokyo|jp
Kyoto|Japan|Asia/Tokyo|jp
Sapporo|Japan|Asia/Tokyo|jp
Seoul|South Korea|Asia/Seoul|korea
Busan|South Korea|Asia/Seoul|korea
Pyongyang|North Korea|Asia/Pyongyang|
Beijing|China|Asia/Shanghai|peking prc
Shanghai|China|Asia/Shanghai|prc
Shenzhen|China|Asia/Shanghai|prc
Guangzhou|China|Asia/Shanghai|canton prc
Chengdu|China|Asia/Shanghai|prc
Hong Kong|China|Asia/Hong_Kong|hk
Macau|China|Asia/Macau|macao
Taipei|Taiwan|Asia/Taipei|
Ulaanbaatar|Mongolia|Asia/Ulaanbaatar|ulan bator
Manila|Philippines|Asia/Manila|ph
Cebu|Philippines|Asia/Manila|ph
Singapore|Singapore|Asia/Singapore|sg
Kuala Lumpur|Malaysia|Asia/Kuala_Lumpur|kl my
Penang|Malaysia|Asia/Kuala_Lumpur|
Jakarta|Indonesia|Asia/Jakarta|
Bali|Indonesia|Asia/Makassar|denpasar
Bangkok|Thailand|Asia/Bangkok|th
Phuket|Thailand|Asia/Bangkok|
Hanoi|Vietnam|Asia/Ho_Chi_Minh|
Ho Chi Minh City|Vietnam|Asia/Ho_Chi_Minh|saigon hcmc
Phnom Penh|Cambodia|Asia/Phnom_Penh|
Yangon|Myanmar|Asia/Yangon|rangoon
Dhaka|Bangladesh|Asia/Dhaka|
Kathmandu|Nepal|Asia/Kathmandu|
Thimphu|Bhutan|Asia/Thimphu|
Colombo|Sri Lanka|Asia/Colombo|
Malé|Maldives|Indian/Maldives|male
Mumbai|India|Asia/Kolkata|bombay ist
Delhi|India|Asia/Kolkata|new delhi ist
Bengaluru|India|Asia/Kolkata|bangalore ist
Chennai|India|Asia/Kolkata|madras ist
Hyderabad|India|Asia/Kolkata|ist
Kolkata|India|Asia/Kolkata|calcutta ist
Pune|India|Asia/Kolkata|ist
Karachi|Pakistan|Asia/Karachi|
Lahore|Pakistan|Asia/Karachi|
Islamabad|Pakistan|Asia/Karachi|
Kabul|Afghanistan|Asia/Kabul|
Tashkent|Uzbekistan|Asia/Tashkent|
Almaty|Kazakhstan|Asia/Almaty|
Astana|Kazakhstan|Asia/Almaty|nur-sultan
Dubai|United Arab Emirates|Asia/Dubai|uae
Abu Dhabi|United Arab Emirates|Asia/Dubai|uae
Muscat|Oman|Asia/Muscat|
Doha|Qatar|Asia/Qatar|
Manama|Bahrain|Asia/Bahrain|
Kuwait City|Kuwait|Asia/Kuwait|
Riyadh|Saudi Arabia|Asia/Riyadh|ksa
Jeddah|Saudi Arabia|Asia/Riyadh|ksa
Tehran|Iran|Asia/Tehran|
Baghdad|Iraq|Asia/Baghdad|
Baku|Azerbaijan|Asia/Baku|
Tbilisi|Georgia|Asia/Tbilisi|
Yerevan|Armenia|Asia/Yerevan|
Tel Aviv|Israel|Asia/Jerusalem|
Jerusalem|Israel|Asia/Jerusalem|
Amman|Jordan|Asia/Amman|
Beirut|Lebanon|Asia/Beirut|
Istanbul|Turkey|Europe/Istanbul|türkiye
Ankara|Turkey|Europe/Istanbul|türkiye
Moscow|Russia|Europe/Moscow|msk
Saint Petersburg|Russia|Europe/Moscow|st petersburg
Novosibirsk|Russia|Asia/Novosibirsk|
Vladivostok|Russia|Asia/Vladivostok|
Kyiv|Ukraine|Europe/Kyiv|kiev
Minsk|Belarus|Europe/Minsk|
Athens|Greece|Europe/Athens|
Bucharest|Romania|Europe/Bucharest|
Sofia|Bulgaria|Europe/Sofia|
Helsinki|Finland|Europe/Helsinki|
Tallinn|Estonia|Europe/Tallinn|
Riga|Latvia|Europe/Riga|
Vilnius|Lithuania|Europe/Vilnius|
Warsaw|Poland|Europe/Warsaw|
Kraków|Poland|Europe/Warsaw|krakow
Prague|Czechia|Europe/Prague|czech republic
Vienna|Austria|Europe/Vienna|
Budapest|Hungary|Europe/Budapest|
Belgrade|Serbia|Europe/Belgrade|
Zagreb|Croatia|Europe/Zagreb|
Berlin|Germany|Europe/Berlin|de
Munich|Germany|Europe/Berlin|münchen
Frankfurt|Germany|Europe/Berlin|
Hamburg|Germany|Europe/Berlin|
Zurich|Switzerland|Europe/Zurich|zürich
Geneva|Switzerland|Europe/Zurich|
Rome|Italy|Europe/Rome|
Milan|Italy|Europe/Rome|milano
Paris|France|Europe/Paris|fr
Lyon|France|Europe/Paris|
Nice|France|Europe/Paris|
Monaco|Monaco|Europe/Monaco|
Brussels|Belgium|Europe/Brussels|
Amsterdam|Netherlands|Europe/Amsterdam|holland nl
Luxembourg|Luxembourg|Europe/Luxembourg|
Copenhagen|Denmark|Europe/Copenhagen|
Stockholm|Sweden|Europe/Stockholm|
Oslo|Norway|Europe/Oslo|
Madrid|Spain|Europe/Madrid|es
Barcelona|Spain|Europe/Madrid|
Valencia|Spain|Europe/Madrid|
Canary Islands|Spain|Atlantic/Canary|las palmas tenerife
Lisbon|Portugal|Europe/Lisbon|
Porto|Portugal|Europe/Lisbon|
Azores|Portugal|Atlantic/Azores|
London|United Kingdom|Europe/London|uk england gb britain
Manchester|United Kingdom|Europe/London|uk
Edinburgh|United Kingdom|Europe/London|uk scotland
Belfast|United Kingdom|Europe/London|uk
Dublin|Ireland|Europe/Dublin|
Reykjavik|Iceland|Atlantic/Reykjavik|
Cairo|Egypt|Africa/Cairo|
Casablanca|Morocco|Africa/Casablanca|
Tunis|Tunisia|Africa/Tunis|
Algiers|Algeria|Africa/Algiers|
Lagos|Nigeria|Africa/Lagos|
Abuja|Nigeria|Africa/Lagos|
Accra|Ghana|Africa/Accra|
Dakar|Senegal|Africa/Dakar|
Abidjan|Côte d'Ivoire|Africa/Abidjan|ivory coast
Kinshasa|DR Congo|Africa/Kinshasa|
Luanda|Angola|Africa/Luanda|
Nairobi|Kenya|Africa/Nairobi|
Addis Ababa|Ethiopia|Africa/Addis_Ababa|
Kampala|Uganda|Africa/Kampala|
Dar es Salaam|Tanzania|Africa/Dar_es_Salaam|
Kigali|Rwanda|Africa/Kigali|
Johannesburg|South Africa|Africa/Johannesburg|joburg za
Cape Town|South Africa|Africa/Johannesburg|za
Harare|Zimbabwe|Africa/Harare|
Lusaka|Zambia|Africa/Lusaka|
Maputo|Mozambique|Africa/Maputo|
Windhoek|Namibia|Africa/Windhoek|
Antananarivo|Madagascar|Indian/Antananarivo|
Port Louis|Mauritius|Indian/Mauritius|
São Paulo|Brazil|America/Sao_Paulo|sao paulo br
Rio de Janeiro|Brazil|America/Sao_Paulo|rio br
Brasília|Brazil|America/Sao_Paulo|brasilia
Manaus|Brazil|America/Manaus|
Buenos Aires|Argentina|America/Argentina/Buenos_Aires|
Montevideo|Uruguay|America/Montevideo|
Asunción|Paraguay|America/Asuncion|asuncion
Santiago|Chile|America/Santiago|
La Paz|Bolivia|America/La_Paz|
Lima|Peru|America/Lima|
Quito|Ecuador|America/Guayaquil|
Bogotá|Colombia|America/Bogota|bogota
Medellín|Colombia|America/Bogota|medellin
Caracas|Venezuela|America/Caracas|
Panama City|Panama|America/Panama|
San José|Costa Rica|America/Costa_Rica|san jose
Guatemala City|Guatemala|America/Guatemala|
Mexico City|Mexico|America/Mexico_City|cdmx
Guadalajara|Mexico|America/Mexico_City|
Monterrey|Mexico|America/Monterrey|
Cancún|Mexico|America/Cancun|cancun
Tijuana|Mexico|America/Tijuana|
Havana|Cuba|America/Havana|
Kingston|Jamaica|America/Jamaica|
Santo Domingo|Dominican Republic|America/Santo_Domingo|
San Juan|Puerto Rico|America/Puerto_Rico|
Port of Spain|Trinidad and Tobago|America/Port_of_Spain|
Nassau|Bahamas|America/Nassau|
Bermuda|Bermuda|Atlantic/Bermuda|hamilton
New York|United States|America/New_York|nyc ny usa est eastern
Boston|United States|America/New_York|usa est
Washington, D.C.|United States|America/New_York|dc usa est
Philadelphia|United States|America/New_York|philly usa
Atlanta|United States|America/New_York|usa est
Miami|United States|America/New_York|usa est
Detroit|United States|America/Detroit|usa
Chicago|United States|America/Chicago|usa cst central
Houston|United States|America/Chicago|usa cst
Dallas|United States|America/Chicago|usa cst
Austin|United States|America/Chicago|usa cst
New Orleans|United States|America/Chicago|usa
Minneapolis|United States|America/Chicago|usa
Denver|United States|America/Denver|usa mst mountain
Salt Lake City|United States|America/Denver|usa mst
Phoenix|United States|America/Phoenix|arizona usa
Las Vegas|United States|America/Los_Angeles|usa pst
Los Angeles|United States|America/Los_Angeles|la usa pst pacific
San Francisco|United States|America/Los_Angeles|sf bay area usa pst
San Diego|United States|America/Los_Angeles|usa pst
Seattle|United States|America/Los_Angeles|usa pst
Portland|United States|America/Los_Angeles|usa pst
Anchorage|United States|America/Anchorage|alaska usa
Toronto|Canada|America/Toronto|ca
Montreal|Canada|America/Toronto|montréal
Ottawa|Canada|America/Toronto|
Winnipeg|Canada|America/Winnipeg|
Calgary|Canada|America/Edmonton|
Edmonton|Canada|America/Edmonton|
Vancouver|Canada|America/Vancouver|
Halifax|Canada|America/Halifax|
St. John's|Canada|America/St_Johns|newfoundland
Nuuk|Greenland|America/Nuuk|godthab
UTC|Coordinated Universal Time|UTC|gmt zulu
`.trim().split('\n').map(l => {
  const [name, country, tz, alias = ''] = l.split('|');
  return { name, country, tz, alias };
});
