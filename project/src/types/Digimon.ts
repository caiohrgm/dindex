export interface Digimon {
  id: string | undefined;
  name: string;
  level: string;
  image: string;
  attribute?: string;
  family?: string[];  
  attacks?: { name: string; description: string }[];
  prior_forms?: string[];
  next_forms?: string[];
  lateral_next_forms?: string[];
  digifuse_forms?: string[];
}