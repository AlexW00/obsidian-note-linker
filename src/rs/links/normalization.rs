use std::collections::HashSet;

pub fn normalize_existing_link_key(value: &str) -> Option<String> {
    let trimmed = value.trim();
    if trimmed.is_empty() {
        return None;
    }

    let anchor_index = trimmed.find('#');
    let without_anchor = match anchor_index {
        Some(index) => &trimmed[..index],
        None => trimmed,
    };

    let lowered = without_anchor.trim().to_lowercase();
    if lowered.is_empty() {
        return None;
    }

    let normalized = lowered.strip_suffix(".md").unwrap_or(&lowered);

    if normalized.is_empty() {
        None
    } else {
        Some(normalized.to_string())
    }
}

pub fn normalized_link_keys_from(title: &str, path: &str, aliases: &[String]) -> HashSet<String> {
    let mut normalized: HashSet<String> = HashSet::new();

    if let Some(value) = normalize_existing_link_key(title) {
        normalized.insert(value);
    }
    if let Some(value) = normalize_existing_link_key(path) {
        normalized.insert(value);
    }
    if path.ends_with(".md") {
        if let Some(value) = normalize_existing_link_key(&path[..path.len() - 3]) {
            normalized.insert(value);
        }
    }
    for alias in aliases {
        if let Some(value) = normalize_existing_link_key(alias) {
            normalized.insert(value);
        }
    }

    normalized
}
