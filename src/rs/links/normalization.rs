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

#[cfg(test)]
mod tests {
    use super::normalize_existing_link_key;

    #[test]
    fn trims_and_lowercases_values() {
        assert_eq!(
            normalize_existing_link_key("  Some Note  "),
            Some("some note".to_string())
        );
    }

    #[test]
    fn strips_anchor_segments() {
        assert_eq!(
            normalize_existing_link_key("Note Title#Heading"),
            Some("note title".to_string())
        );
    }

    #[test]
    fn removes_md_suffixes() {
        assert_eq!(
            normalize_existing_link_key("Folder/Note.md"),
            Some("folder/note".to_string())
        );
    }

    #[test]
    fn returns_none_for_empty_values() {
        assert_eq!(normalize_existing_link_key(""), None);
        assert_eq!(normalize_existing_link_key("   "), None);
        assert_eq!(normalize_existing_link_key("#anchor"), None);
    }
}
