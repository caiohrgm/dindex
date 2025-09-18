import re
import pandas as pd
import ast

PRIMARY = ['Vaccine', 'Virus', 'Data']
SECONDARY = ['Free', 'Variable', 'No Attribute', 'Unknown']

def remove_type_column(df):
    if 'type' in df.columns:
        df = df.drop(['type'], axis=1)
    
    return df

def normliza_column_name(df):
    df['name'] = df['name'].str.replace('_', ' ', regex=False)
    return df

def normalize_name(name):
    
    # 1. Se tiver "(Black)", trata antes de qualquer limpeza
    if re.search(r"\(Black\)", name, re.IGNORECASE):
        base = re.sub(r"\s*\(.*?\)", "", name).strip()
        return base + " Black"

    # 2. Remover "Core"
    name = re.sub(r"\bCore\b", "", name).strip()

    # 3. Remover qualquer coisa entre parênteses
    name = re.sub(r"\s*\(.*?\)", "", name).strip()

    return name

# Normalizando os valores da coluna 'level'
def normalize_level(value):
    if pd.isna(value) or str(value).strip().lower() == 'unidentified':
        return 'Unknown'
    
    value = str(value).strip()
    
    if value.startswith('{') and value.endswith('}'):
        value = value[1:-1].split(',')[0].strip()
    
    value = value.split('/')[0].strip()
    value = value.split()[0].strip()
    
    return value

def normalize_attribute(value):
    if pd.isna(value):
        return 'Unknown'
    
    value = str(value).strip()
    
    if value.upper() in ['NO DATA', 'NONE', 'UNIDENTIFIED']:
        return 'Unknown'
    
    if value.startswith('{') and value.endswith('}'):
        value = value[1:-1]
    
    attrs = [v.strip() for v in value.split(',')]
    
    prim = [v for v in attrs if v in PRIMARY]
    sec = [v for v in attrs if v in SECONDARY]
    
    prim_attr = prim[0] if prim else None
    
    sec_attr = None
    for s in sec:
        if s not in ['Unidentified', 'Unknown']:
            sec_attr = s
            break
    
    if prim_attr and sec_attr:
        return f'{prim_attr} / {sec_attr}'
    elif prim_attr:
        return prim_attr
    elif sec_attr:
        return sec_attr
    else:
        return 'Unknown'

# Normalizando a coluna family:
def normalize_family(value):
    if pd.isna(value) or value.strip() == '[]':
        return 'Unknown'
    
    value = value.strip()
    
    if value.startswith('[') and value.endswith(']'):
        try:
            lst = ast.literal_eval(value)
            if lst:
                return lst[0]
            else:
                return 'Unknown'
        except:
            return 'Unknown'
    else:
        return value.strip('"')

# Normalizando 'prior_forms':
def normalize_prior_forms(val):
    # Se for string, tenta converter para lista
    if isinstance(val, str):
        try:
            val = ast.literal_eval(val)
        except:
            val = []
    # Se não for lista, transforma em lista vazia
    if not isinstance(val, list):
        val = []
    
    # Se tiver elementos, pega só o primeiro
    if val:
        return val[0]
    return None

# Normalizando as colunas 'next_forms' e 'lateral_next_forms':
def format_list_column(val):
    # Se for string, tenta converter para lista
    if isinstance(val, str):
        try:
            val = ast.literal_eval(val)
        except:
            val = []
    if not isinstance(val, list):
        val = []
    
    if not val:  # lista vazia
        return None
    if len(val) == 1:  # só um elemento
        return val[0]
    return " | ".join(val)  # mais de um elemento

# Normalziando a coluna'digifuse_forms':
pattern = re.compile(r'(?i)\bdigifuse[s]?\s*chart[s]?\b') 
def clean_digifuse(val):
    # nulos
    if pd.isna(val):
        return None

    # construir lista de itens a partir de diferentes formatos
    lst = []
    if isinstance(val, str):
        s = val.strip()
        # caso seja string que representa lista: '["A", "B"]'
        if s.startswith('[') and s.endswith(']'):
            try:
                lst = ast.literal_eval(s)
            except Exception:
                # fallback: tentar extrair entre colchetes e split por vírgula
                inner = s[1:-1]
                lst = [x.strip().strip('"').strip("'") for x in inner.split(',') if x.strip()]
        # caso já esteja juntado por " | "
        elif '|' in s:
            lst = [x.strip() for x in s.split('|') if x.strip()]
        else:
            # string simples
            lst = [s]
    elif isinstance(val, (list, tuple)):
        lst = list(val)
    else:
        # qualquer outro tipo: tenta converter pra string única
        lst = [str(val)]

    # normalizar e filtrar itens "DigiFuse Chart(s)"
    cleaned = []
    for item in lst:
        if item is None:
            continue
        it = str(item).strip().strip('"').strip("'").strip()
        if pattern.search(it):
            continue
        if it: 
            cleaned.append(it)

    if not cleaned:
        return None
    if len(cleaned) == 1:
        return cleaned[0]
    return " | ".join(cleaned)

# Normalizando a coluna 'attacks':
def normalize_attacks(val):
    if pd.isna(val):
        return None

    attacks = []

    if isinstance(val, str):
        val = val.strip()
        if val.startswith('[') and val.endswith(']'):
            try:
                lst = ast.literal_eval(val)
            except Exception:
                return 'Unknown'
        else:
            return 'Unknown'
    elif isinstance(val, list):
        lst = val
    else:
        return 'Unknown'

    for item in lst:
        if isinstance(item, dict) and 'name' in item:
            name = str(item['name']).strip()
            if name:
                attacks.append(name)

    if not attacks:
        return 'Unknown'

    result = " | ".join(attacks)

    # substitui caso o único valor seja Digimon Story
    if len(attacks) == 1 and "Digimon Story" in attacks[0]:
        return "Unknown"
    return result
