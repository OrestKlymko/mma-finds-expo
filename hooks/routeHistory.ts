const stack: string[] = [];

export const pushPath = (p: string) => {
    if (stack[stack.length - 1] !== p) stack.push(p);
};

export const popPrev = () => {
    stack.pop();
    return stack.pop() ?? null;
};
