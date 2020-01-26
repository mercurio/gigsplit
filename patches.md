# jSuites error

If you get an error like:

        on line 2947 of /home/pjm/work/gigsplit/node_modules/jsuites/dist/jsuites.css
        >>         background: rgba(92,92,92);
           --------------------^

edit node_modules/jsuites/dist/jsuites.css and fix lines 2946-7 to read:

        background-color: #000;
        background: rgb(92,92,92);

and then run ./copyCss.sh.

# @smui error

In `node_modules/@smui/select/Option.svelte` change `let` on line 29 to `const`
