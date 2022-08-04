use std::convert::TryFrom;

use fancy_regex::Captures;

use crate::rs::Errors::cast_error::CastError;
use crate::rs::util::range::Range;

pub struct RegexMatch {
    pub position: Range,
    pub matched_text: String,
    pub capture_index: usize,
}


impl<'c> TryFrom<Captures<'c>> for RegexMatch {
    type Error = CastError;

    fn try_from(captures: Captures) -> Result<Self, CastError> {
        let valid = captures.iter()
            .enumerate()
            .find_map(|(i, c)| c.map(|c_| (c_, i)));

        match valid {
            Some((m, capture_index)) => {
                Ok(
                    RegexMatch {
                        position: Range::new(m.start(), m.end()),
                        matched_text: m.as_str().to_string(),
                        capture_index,
                    }
                )
            }
            _ => Err(CastError::CapturesToRegexMatch())
        }
    }
}