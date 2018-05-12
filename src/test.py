import os
currentDir=os.getcwd()
"Current directory is <b>"+currentDir+"</b>"

the_smiths={'vocals':'Morrissey',
    'guitar':'Johnny Marr',
    'the bass guitar':'Andy Rourke',
    'the drums':'Mike Joyce'}
"""
<table border=1>
<tr backgroundcolor=green>
<td>One of the best pop bands ever</td>
</tr>
</table>
<table>
"""
for item in the_smiths.keys():
    "<tr><td>%s</td><td>%s</td></tr>" %(item,the_smiths[item])
"</table>"