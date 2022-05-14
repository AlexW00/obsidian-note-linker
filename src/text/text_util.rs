use std::error::Error;
use std::fs;
use std::path::Path;
use fancy_regex::Regex;

pub fn trim_file_extension (filename: &String) -> String {
    let mut filename_without_extension = filename.clone();
    if let Some(pos) = filename_without_extension.rfind('.') {
        filename_without_extension.truncate(pos);
    }
    filename_without_extension
}

/// Returns the file content as a String
pub fn get_file_content (path: &Path) -> Result<String, Box<dyn Error>> {
    let content: String = fs::read_to_string(path)?.parse()?;
    Ok(content)
}

/// Function to check if a file is a markdown file.
pub fn is_markdown_file(filename: &String) -> bool {
    let md_extension = ".md";
    let len = filename.len();
    if len > 3 {
        let file_type = filename.chars().rev().take(3).fold(String::from(""), |p: String, n : char| {
            format!("{}{}", n, p)
        } );
        return file_type.eq(&md_extension)
    }
    false
}

/// Function to check if a directory exists, if not, throw an error.
pub fn check_if_dir_exists(dir: &String) {
    assert!(Path::new(dir).exists(), "Directory does not exist");
}

/// Creates a string with n times character c.
pub fn create_string_with_n_characters(n: usize, c: char) -> String {
    let mut s = String::new();
    for _ in 0..n {
        s.push(*&c);
    }
    s
}

pub fn combine_regular_expressions(regexes: [&str; 4]) -> Regex {
    let mut regex = String::new();
    regex.push_str("(");
    for r in regexes {
        regex.push_str(r);
        regex.push_str("|");
    }
    regex.push_str(")");
    Regex::new(&regex).unwrap()
}