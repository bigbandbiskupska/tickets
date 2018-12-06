#!/usr/local/bin/python3
import os
import re
import subprocess
import sys

import requests

seats = "http://seats.bigbandbiskupska.cz/api/v1/schema/{}/seats?token=ows79slglltpic3ux73wfet5gopvj8hjynzl95w7rkd50muogn8p2suzmryqcb7znq9ekzmfso45srk116d08y3rp7kmw5b0wj4qnec3qj7unan7apsapop5e8yuiofh"
command = "cat actions.log | grep 'User' | sed 's/[ ]\\{1,\\}@[ ]\\{1,\\}http:\\/\\/.*$// ; s/User \\[[0-9]\\{1,\\}\\] (\\([^)]\\{1,\\}\\))/\\1/ ; s/(\\([^-]\\{1,\\}-[ ]\\{1,\\}\\([^)]\\{1,\\}\\)\\{1,\\}\\))\\.$/\\2/ ; s/schema \\[[0-9]\\] //' | tail -n +20"


def get_seats(schemas):
    result = {}

    for schema in schemas:
        r = requests.get(seats.format(schema))
        r.raise_for_status()

        json = r.json()

        result.update(json)

    return result


def replace_line(seats):
    processed = set()
    suspicious = {}

    def x(match):
        user_seats = map(
            lambda x: 'r{}s{}'.format(seats.get(x)['row'], seats.get(x)['col']),
            match.group(2).split(','))
        if 'created' in match.group(0) or 'deleted' in match.group(0):
            for seat in match.group(2).split(','):
                if seat in processed:
                    if seats.get(seat)['schema_id'] not in suspicious:
                        suspicious[seats.get(seat)['schema_id']] = set()
                    suspicious[seats.get(seat)['schema_id']].add(seat)
                processed.add(seat)
        return '{} seats [{}]'.format(match.group(1), ', '.join(user_seats))

    return x, suspicious


def process_output(output):
    seats = get_seats((1, 2))
    match, suspicious = replace_line(seats)
    for line in output:
        line = re.sub('(.*) seats \[(\d+(,\d+)*)\\]', match, line)
        print(line)

    if suspicious:
        print('=' * 40)
        print('Suspicious seats:')
        print('=' * 40)
        for schema in suspicious:
            print('{}:'.format(schema))
            for seat in map(lambda x: 'r{}s{} ({})'.format(seats.get(x)['row'],
                                                           seats.get(x)['col'],
                                                           x),
                            sorted(list(suspicious.get(schema)),
                                   key=lambda x: int(x))):
                print(seat)


def main():
    output = subprocess.check_output(command, shell=True,
                                     universal_newlines=True)
    output = output.split('\n')

    if not output:
        print("No output from shell")
        sys.exit(1)

    process_output(list(filter(lambda x: len(x) != 0, output)))


if __name__ == '__main__':
    if not os.path.exists('actions.log'):
        print('actions.log does not exist in the current working directory')
        sys.exit(1)
    main()
