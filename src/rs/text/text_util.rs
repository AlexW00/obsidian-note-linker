/// Creates a string with n times character c.
pub fn create_string_with_n_characters(n: &usize, c: char) -> String {
    let mut s = String::new();
    for _ in 0..*n {
        s.push(c);
    }
    s
}

/// returns the nearest char boundary that is not an emoji
pub fn get_nearest_char_boundary(text: &str, position: usize, do_expand_left: bool) -> usize {
    let mut i = position;
    let mut direction = do_expand_left;
    while i > 0 && !text.is_char_boundary(i) {
        if text.len() == i || i == 0 {
            direction = !direction;
        }
        if direction {
            i -= 1;
        } else {
            i += 1;
        }
    }
    i
}