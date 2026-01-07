def prompt_selector(gender, theme, opt_text=''):
    
    gender_based_prompts = {
        "male": f"""A realistic cinematic video generated from the provided image of a male subject.
Preserve facial identity, skin tone, hairstyle, and body proportions from the reference image.
Animate natural head movement, subtle facial expressions, and realistic eye blinking.
The subject performs smooth, confident motions that match the selected theme: {theme}.
Lighting, environment, clothing style, and background should reflect the chosen theme.
High-quality cinematic lighting, realistic shadows, depth of field, smooth camera motion,
professional video look, natural motion flow, ultra-detailed, photorealistic.""",

        "female": f"""A realistic cinematic video generated from the provided image of a female subject.
Maintain accurate facial identity, skin texture, hair details, and body proportions from the reference image.
Animate graceful head movement, natural facial expressions, and soft eye blinking.
The subject moves elegantly and naturally according to the selected theme: {theme}.
Lighting, outfit, environment, and background should be consistent with the chosen theme.
High-quality cinematic lighting, soft shadows, depth of field, smooth camera motion,
professional video quality, realistic motion, ultra-detailed, photorealistic."""
    }

    return gender_based_prompts[gender.lower()] + opt_text



if __name__ == '__main__':
    gender = "female"
    opt_text = "animated"
    theme='welcome'

    prompt = prompt_selector(gender, theme, opt_text)

    print(prompt)
