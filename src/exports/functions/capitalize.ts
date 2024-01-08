export const Capitalize = (word: string) => {return word.charAt(0).toUpperCase() + word.slice(1)}

export function capitalizeFirstLetters(name: string) {
    return name.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
    });
}
