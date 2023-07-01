import asyncio


async def print_(text):
    print(text)


async def async_print(value):
    await asyncio.sleep(3)
    print(str(value) + ' 123')


async def m():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(print_('print 1'))
        tg.create_task(async_print('www'))
        tg.create_task(print_('print 2'))


asyncio.run(m())




